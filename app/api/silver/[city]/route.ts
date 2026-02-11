import { NextRequest, NextResponse } from 'next/server';
import { getBrowser } from '@/lib/browser'; 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  // Fix: Await the params
  const { city } = await params;

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
  }

  const url = `https://www.angelone.in/silver-rates-today/silver-rate-in-${city.toLowerCase()}`;
  
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const rawRate = await page.evaluate(() => {
      const rows = document.querySelectorAll('tr');
      for (const row of Array.from(rows)) {
        const cells = row.querySelectorAll('td');
        if (cells.length > 1 && (cells[0] as HTMLElement).innerText.trim().toLowerCase() === '1 gm') {
          return (cells[1] as HTMLElement).innerText.trim();
        }
      }
      return null;
    });

    if (!rawRate) {
      return NextResponse.json({ error: 'Rate not found' }, { status: 404 });
    }

    const cleanRate = parseFloat(rawRate.replace(/[^\d.]/g, ''));

    return NextResponse.json({ rate: cleanRate });

  } catch (error) {
    console.error('Scraping Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
