import { NextRequest, NextResponse } from 'next/server';
import { getBrowser } from '@/lib/browser'; // Ensure this path is correct

export async function GET(
  request: NextRequest,
  // Change 1: Define params as a Promise
  { params }: { params: Promise<{ city: string }> }
) {
  // Change 2: Await the params object
  const { city } = await params;

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
  }

  const url = `https://www.angelone.in/gold-rates-today/gold-rate-in-${city.toLowerCase()}`;
  
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    // Optimize: Block images/fonts
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
      // Convert NodeList to Array for safer iteration
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

    // Clean formatting
    const cleanRate = parseFloat(rawRate.replace(/[^\d.]/g, ''));

    return NextResponse.json({ rate: cleanRate });

  } catch (error) {
    console.error('Scraping Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
