const { PrismaClient } = require('@bambu/colossus/prisma/central-db');
const _ = require('lodash');
const crypto = require('crypto');

const CONSTANTS = {
  DEFAULT_USER: 'Bambu',
};

const WEALTH_KERNEL_INSTRUMENTS = [
  {
    'ISIN Code': 'IE00B5BMR087',
    Ticker: 'CSPX',
    Exchange: 'XLON',
    'Long Name': 'iShares Core S&P 500 UCITS ETF USD (Acc)',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund?switchLocale=y&siteEntryPassthrough=true',
  },
  {
    'ISIN Code': 'IE00B4L5Y983',
    Ticker: 'IWDA',
    Exchange: 'XLON',
    'Long Name': 'iShares Core MSCI World UCITS ETF USD (Acc)',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251882/ishares-msci-world-ucits-etf-acc-fund',
  },
  {
    'ISIN Code': 'IE00B3XXRP09',
    Ticker: 'VUSA',
    Exchange: 'XLON',
    'Long Name': 'Vanguard S&P 500 UCITS ETF USD Dis',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.vanguardinvestor.co.uk/investments/vanguard-s-and-p-500-ucits-etf-usd-distributing/overview?query=IE00B3XXRP09',
  },
  {
    'ISIN Code': 'IE00B3RBWM25',
    Ticker: 'VWRL',
    Exchange: 'XLON',
    'Long Name': 'Vanguard FTSE All-World UCITS ETF USD Dis',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.vanguardinvestor.co.uk/investments/vanguard-ftse-all-world-ucits-etf-usd-distributing/overview',
  },
  {
    'ISIN Code': 'IE00B3YCGJ38',
    Ticker: 'SPXS',
    Exchange: 'XLON',
    'Long Name': 'Invesco S&P 500 UCITS ETF Acc',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://etf.invesco.com/gb/private/en/product/invesco-sp-500-ucits-etf-acc/trading-information?audienceType=private',
  },
  {
    'ISIN Code': 'IE00B3F81R35',
    Ticker: 'IEAC',
    Exchange: 'XLON',
    'Long Name': 'iShares Core € Corp Bond UCITS ETF EUR D',
    Currency: 'EUR',
    'Asset Class': 'Bonds',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251726/',
  },
  {
    'ISIN Code': 'IE00B579F325',
    Ticker: 'SGLD',
    Exchange: 'XLON',
    'Long Name': 'Invesco Physical Gold ETC',
    Currency: 'USD',
    'Asset Class': 'Others',
    'link to fs':
      'https://etf.invesco.com/gb/private/en/product/invesco-physical-gold-etc/trading-information?audienceType=private&_ga=2.53135840.956770675.1695291548-1533226516.1695291548',
  },
  {
    'ISIN Code': 'IE00B4ND3602',
    Ticker: 'IGLN',
    Exchange: 'XLON',
    'Long Name': 'iShares Physical Gold ETC',
    Currency: 'USD',
    'Asset Class': 'Others',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/258441/',
  },
  {
    'ISIN Code': 'IE0031442068',
    Ticker: 'IUSA',
    Exchange: 'XLON',
    'Long Name': 'iShares Core S&P 500 UCITS ETF USD (Dist)',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251900/',
  },
  {
    'ISIN Code': 'IE0005042456',
    Ticker: 'ISF',
    Exchange: 'XLON',
    'Long Name': 'iShares Core FTSE 100 UCITS ETF GBP Dist',
    Currency: 'GBP',
    'Asset Class': 'Equities',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251795/',
  },
  {
    'ISIN Code': 'IE00B53SZB19',
    Ticker: 'CSNDX',
    Exchange: 'XLON',
    'Long Name': 'iShares NASDAQ 100 UCITS ETF USD (Acc)',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/253741/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B14X4S71',
    Ticker: 'IBTS',
    Exchange: 'XLON',
    'Long Name': 'iShares $ Treasury Bd 1-3yr UCITS ETF USD Dist',
    Currency: 'USD',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251715/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B1FZS798',
    Ticker: 'IBTM',
    Exchange: 'XLON',
    'Long Name': 'iShares $ Treasury Bd 7-10y UCITS ETF USD Dist',
    Currency: 'USD',
    'Asset Class': 'Bonds',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251716/',
  },
  {
    'ISIN Code': 'LU0496786657',
    Ticker: 'LSPU',
    Exchange: 'XLON',
    'Long Name': 'Lyxor S&P 500 UCITS ETF - Dist (USD)',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.amundietf.lu/en/individual/products/equity/lyxor-sp-500-ucits-etf-dist-usd/lu0496786657',
  },
  {
    'ISIN Code': 'IE00B6R52259',
    Ticker: 'ISAC',
    Exchange: 'XLON',
    'Long Name': 'iShares MSCI ACWI UCITS ETF USD (Acc)',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251850/',
  },
  {
    'ISIN Code': 'IE0032895942',
    Ticker: 'LQDE',
    Exchange: 'XLON',
    'Long Name': 'iShares $ Corp Bond UCITS ETF USD Dist',
    Currency: 'USD',
    'Asset Class': 'Bonds',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251832/',
  },
  {
    'ISIN Code': 'IE00B1YZSC51',
    Ticker: 'IMEU',
    Exchange: 'XLON',
    'Long Name': 'iShares Core MSCI Europe UCITS ETF EUR Dist',
    Currency: 'EUR',
    'Asset Class': 'Equities',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251860/',
  },
  {
    'ISIN Code': 'LU0490618542',
    Ticker: 'D5BM',
    Exchange: 'XLON',
    'Long Name': 'Xtrackers S&P 500 Swap UCITS ETF 1C',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://etf.dws.com/en-gb/LU0490618542-s-p-500-swap-ucits-etf-1c/',
  },
  {
    'ISIN Code': 'IE0032077012',
    Ticker: 'EQQQ',
    Exchange: 'XLON',
    'Long Name': 'Invesco EQQQ NASDAQ-100 UCITS ETF Dist',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://etf.invesco.com/gb/private/en/product/invesco-eqqq-nasdaq-100-ucits-etf-dist/trading-information?audienceType=private&_ga=2.53135840.956770675.1695291548-1533226516.1695291548',
  },
  {
    'ISIN Code': 'IE00B2NPKV68',
    Ticker: 'SEMB',
    Exchange: 'XLON',
    'Long Name': 'iShares JP Morgan $ EM Bond UCITS ETF USD Dis',
    Currency: 'USD',
    'Asset Class': 'Bonds',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251824/',
  },
  {
    'ISIN Code': 'LU0908500753',
    Ticker: 'MEUD',
    Exchange: 'XLON',
    'Long Name': 'Lyxor Core STOXX Europe 600 (DR) - UCITS ETF Acc',
    Currency: 'EUR',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.amundietf.lu/en/individual/products/equity/lyxor-core-stoxx-europe-600-dr-ucits-etf-acc/lu0908500753',
  },
  {
    'ISIN Code': 'IE00B4X9L533',
    Ticker: 'HMWO',
    Exchange: 'XLON',
    'Long Name': 'HSBC MSCI World UCITS ETF USD',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.londonstockexchange.com/stock/HMWD/hsbc/company-page',
  },
  {
    'ISIN Code': 'IE00B0M62Q58',
    Ticker: 'IWRD',
    Exchange: 'XLON',
    'Long Name': 'iShares MSCI World UCITS ETF USD (Dist)',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251881/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B3VWN393',
    Ticker: 'CBU7',
    Exchange: 'XLON',
    'Long Name': 'iShares $ Treasury Bond 3-7yr UCITS ETF USD A',
    Currency: 'USD',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/253744/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'LU0380865021',
    Ticker: 'XESC',
    Exchange: 'XLON',
    'Long Name': 'Xtrackers Euro Stoxx 50 UCITS ETF 1C',
    Currency: 'EUR',
    'Asset Class': 'Equities',
    'link to fs':
      'https://etf.dws.com/en-gb/LU0380865021-euro-stoxx-50-ucits-etf-1c/',
  },
  {
    'ISIN Code': 'LU0274211217',
    Ticker: 'XESX',
    Exchange: 'XLON',
    'Long Name': 'Xtrackers Euro Stoxx 50 UCITS ETF 1D',
    Currency: 'EUR',
    'Asset Class': 'Equities',
    'link to fs':
      'https://etf.dws.com/en-gb/LU0274211217-euro-stoxx-50-ucits-etf-1d/',
  },
  {
    'ISIN Code': 'IE00B66F4759',
    Ticker: 'IHYG',
    Exchange: 'XLON',
    'Long Name': 'iShares € High Yield Corp Bond UCITS ETF EUR D',
    Currency: 'EUR',
    'Asset Class': 'Bonds',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251843/',
  },
  {
    'ISIN Code': 'IE00B810Q511',
    Ticker: 'VUKE',
    Exchange: 'XLON',
    'Long Name': 'Vanguard FTSE 100 UCITS ETF GBP Dis',
    Currency: 'GBP',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.vanguardinvestor.co.uk/investments/vanguard-ftse-100-ucits-etf-gbp-distributing/overview?query=IE00B810Q511',
  },
  {
    'ISIN Code': 'IE00B4K48X80',
    Ticker: 'SMEA',
    Exchange: 'XLON',
    'Long Name': 'iShares Core MSCI Europe UCITS ETF EUR (Acc)',
    Currency: 'EUR',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251861/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B6YX5C33',
    Ticker: 'SPY5',
    Exchange: 'XLON',
    'Long Name': 'SPDR S&P 500 UCITS ETF Dist',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ssga.com/uk/en_gb/intermediary/etfs/funds/spdr-sp-500-ucits-etf-dist-spy5-gy',
  },
  {
    'ISIN Code': 'IE00B5M4WH52',
    Ticker: 'IEML',
    Exchange: 'XLON',
    'Long Name': 'iShares JPM EM Local Govt Bond UCITS ETF USD D',
    Currency: 'USD',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251724/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B3ZW0K18',
    Ticker: 'IUSE',
    Exchange: 'XLON',
    'Long Name': 'iShares S&P 500 EUR Hedged UCITS ETF (Acc)',
    Currency: 'EUR',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251903/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B4PY7Y77',
    Ticker: 'IHYU',
    Exchange: 'XLON',
    'Long Name': 'iShares $ High Yield Corp Bond UCITS ETF USD D',
    Currency: 'USD',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251833/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B4L60045',
    Ticker: 'IE15',
    Exchange: 'XLON',
    'Long Name': 'iShares € Corp Bond 1-5 yr UCITS ETF EUR (Dist)',
    Currency: 'EUR',
    'Asset Class': 'Bonds',
    'link to fs': 'https://www.ishares.com/uk/individual/en/products/251728/',
  },
  {
    'ISIN Code': 'IE00B5KQNG97',
    Ticker: 'HSPX',
    Exchange: 'XLON',
    'Long Name': 'HSBC S&P 500 UCITS ETF USD',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.londonstockexchange.com/stock/HSPX/hsbc/company-page',
  },
  {
    'ISIN Code': 'IE00B3WJKG14',
    Ticker: 'IUIT',
    Exchange: 'XLON',
    'Long Name': 'iShares S&P 500 Info Technolg Sctr UCITS ETF USD A',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/280510/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B4WXJK79',
    Ticker: 'IGLS',
    Exchange: 'XLON',
    'Long Name': 'iShares UK Gilts 0-5yr UCITS ETF GBP (Dist)',
    Currency: 'GBP',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251804/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00BYZK4552',
    Ticker: 'RBOT',
    Exchange: 'XLON',
    'Long Name': 'iShares Automation & Robotics UCITS ETF USD A',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/284219/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00BF4RFH31',
    Ticker: 'WSML',
    Exchange: 'XLON',
    'Long Name': 'iShares MSCI World Small Cap UCITS ETF USD (Acc)',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/296576/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B1FZSB30',
    Ticker: 'IGLT',
    Exchange: 'XLON',
    'Long Name': 'iShares Core UK Gilts UCITS ETF GBP (Dist)',
    Currency: 'GBP',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251806/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B00FV011',
    Ticker: 'SLXX',
    Exchange: 'XLON',
    'Long Name': 'iShares Core £ Corp Bond UCITS ETF GBP (Dist)',
    Currency: 'GBP',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251839/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00B5L65R35',
    Ticker: 'IS15',
    Exchange: 'XLON',
    'Long Name': 'iShares Corp Bond 0-5yr UCITS ETF GBP (Dist)',
    Currency: 'GBP',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/251840/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'IE00BJ38QD84',
    Ticker: 'ZPRR',
    Exchange: 'XLON',
    'Long Name': 'SPDR Russell 2000 US Small Cap UCITS ETF Acc',
    Currency: 'USD',
    'Asset Class': 'Equities',
    'link to fs':
      'https://www.ssga.com/uk/en_gb/intermediary/etfs/funds/spdr-russell-2000-us-small-cap-ucits-etf-acc-zprr-gy',
  },
  {
    'ISIN Code': 'IE00BCRY6441',
    Ticker: 'ERNS',
    Exchange: 'XLON',
    'Long Name': 'iShares £ Ultrashort Bond UCITS ETF GBP (Dist)',
    Currency: 'GBP',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.ishares.com/uk/individual/en/products/258120/?referrer=tickerSearch',
  },
  {
    'ISIN Code': 'LU1407892592',
    Ticker: 'GILS',
    Exchange: 'XLON',
    'Long Name': 'Lyxor Core UK Government Bond (DR) UCITS ETF D',
    Currency: 'GBP',
    'Asset Class': 'Bonds',
    'link to fs':
      'https://www.amundietf.lu/en/individual/products/fixed-income/lyxor-core-uk-government-bond-dr-ucits-etf-dist/lu1407892592',
  },
  {
    'ISIN Code': 'CASH_GBP',
    Ticker: 'CASH_GBP',
    Exchange: 'CASH',
    'Long Name': 'Cash - Pound Sterling',
    Currency: 'GBP',
    'Asset Class': 'Cash',
    'link to fs': null,
  },
];

Object.freeze(WEALTH_KERNEL_INSTRUMENTS);

async function main() {
  const prismaClient = new PrismaClient();

  try {
    console.log(`Seeding Wealth Kernel Instruments - Start`);

    const currencyCodes = _.uniq(
      WEALTH_KERNEL_INSTRUMENTS.map((instrument) => instrument.Currency)
    );

    const currencies = await Promise.all(
      currencyCodes.map((x) => {
        return prismaClient.InstrumentCurrencies.upsert({
          where: { iso4217Code: x },
          update: {},
          create: {
            iso4217Code: x,
          },
        });
      })
    );

    console.log(
      `Currency seeding done. ${JSON.stringify(currencies, null, 2)}`
    );

    const exchangeCodes = _.uniq(
      WEALTH_KERNEL_INSTRUMENTS.map((instrument) => instrument.Exchange)
    );

    const exchanges = await Promise.all(
      exchangeCodes.map((x) => {
        return prismaClient.InstrumentExchanges.upsert({
          where: { bambuExchangeCode: x },
          update: {},
          create: {
            bambuExchangeCode: x,
          },
        });
      })
    );

    console.log(`Exchange seeding done. ${JSON.stringify(exchanges, null, 2)}`);

    const assetClasses = _.uniq(
      WEALTH_KERNEL_INSTRUMENTS.map((instrument) => instrument['Asset Class'])
    );

    const instrumentAssetClasses = await Promise.all(
      assetClasses.map((x) => {
        return prismaClient.InstrumentAssetClasses.upsert({
          where: { name: x },
          update: {},
          create: {
            name: x,
          },
        });
      })
    );

    console.log(
      `Asset class seeding done. ${JSON.stringify(
        instrumentAssetClasses,
        null,
        2
      )}`
    );

    for (let i = 0; i < WEALTH_KERNEL_INSTRUMENTS.length; i += 1) {
      const instrument = WEALTH_KERNEL_INSTRUMENTS[i];
      const {
        'Asset Class': assetClass,
        Currency: currency,
        Exchange: exchange,
        Ticker: ticker,
        'Long Name': longName,
        'ISIN Code': isinCode,
        'link to fs': linkToFs,
      } = instrument;

      const id = crypto
        .createHash('md5')
        .update([isinCode, ticker, exchange, currency].join('.'))
        .digest('hex');

      const instrumentAssetClassId = instrumentAssetClasses.find(
        (x) => x.name === assetClass
      ).id;
      const instrumentExchangeId = exchanges.find(
        (x) => x.bambuExchangeCode === exchange
      ).id;
      const instrumentCurrencyId = currencies.find(
        (x) => x.iso4217Code === currency
      ).id;

      const instrumentPayload = {
        id,
        bloombergTicker: ticker,
        ricSymbol: null,
        isin: isinCode,
        cusip: null,
        name: longName,
        instrumentAssetClassId,
        instrumentExchangeId,
        instrumentCurrencyId,
      };

      const instrumentResult = await prismaClient.Instruments.upsert({
        where: {
          id,
        },
        update: {
          ...instrumentPayload,
        },
        create: instrumentPayload,
      });

      console.log(
        `Instrument seeding done. ${JSON.stringify(instrumentResult, null, 2)}`
      );

      if (linkToFs) {
        const instrumentFactSheetPayload = {
          url: linkToFs,
          instrumentId: id,
        };

        const instrumentFactSheetResult =
          await prismaClient.InstrumentFactSheets.upsert({
            where: {
              url_instrumentId: {
                ...instrumentFactSheetPayload,
              },
            },
            update: {},
            create: instrumentFactSheetPayload,
          });

        console.log(
          `Instrument fact sheet seeding done. ${JSON.stringify(
            instrumentFactSheetResult,
            null,
            2
          )}`
        );
      }
    }

    console.log(`Seeding Wealth Kernel Instruments - End`);
    /**
     * Ensures older entries are updated.
     * This is due to an older decision to use Bambu as a realm name.
     */
    const renameBambuRealmResult = await prismaClient.tenant.updateMany({
      where: {
        realm: 'Bambu',
      },
      data: {
        realm: 'colossus-public',
      },
    });

    const registerApiLibKeysResult = await prismaClient.tenant.upsert({
      where: { realm: 'colossus-public' },
      update: {},
      create: {
        realm: 'colossus-public',
        createdBy: CONSTANTS.DEFAULT_USER,
        updatedBy: CONSTANTS.DEFAULT_USER,
        apiKeys: {
          create: {
            keyType: 'BAMBU_API_LIB',
            keyConfig: { key: 'b05a8321a5bffa78116c58a9' },
            createdBy: CONSTANTS.DEFAULT_USER,
            updatedBy: CONSTANTS.DEFAULT_USER,
          },
        },
        httpUrls: {
          createMany: {
            data: [
              {
                type: 'SYSTEM',
                url: 'http://localhost:4200',
                createdBy: 'Bambu',
                updatedBy: 'Bambu',
              },
              {
                type: 'SYSTEM',
                url: 'http://localhost:4201',
                createdBy: 'Bambu',
                updatedBy: 'Bambu',
              },
            ],
          },
        },
      },
    });

    const platformGoalTypes = [
      {
        name: 'Retirement',
        description: 'Retire comfortably',
        sortKey: 10,
      },
      {
        name: 'House',
        description: 'Buy a house',
        sortKey: 20,
      },
      {
        name: 'Education',
        description: 'Save for college fees',
        sortKey: 30,
      },
      {
        name: 'Growing Wealth',
        description: 'Just want to grow my wealth',
        sortKey: 40,
      },
      {
        name: 'Other',
        description: 'I have another goal in mind',
        sortKey: 50,
      },
    ];

    const deleteOtherGoalTypes = await prismaClient.goalType.deleteMany({
      where: {
        name: {
          notIn: platformGoalTypes.map((goalType) => goalType.name),
        },
      },
    });

    // Note: we upsert rather than truncate and re-insert to preserve dependent tables
    const registerPlatformGoalTypesResult = await Promise.allSettled(
      platformGoalTypes.map(({ name, description, sortKey }) =>
        prismaClient.goalType.upsert({
          where: { name },
          update: {
            description,
            sortKey,
            updatedBy: CONSTANTS.DEFAULT_USER,
          },
          create: {
            name,
            description,
            sortKey,
            createdBy: CONSTANTS.DEFAULT_USER,
            updatedBy: CONSTANTS.DEFAULT_USER,
          },
        })
      )
    );

    return {
      renameBambuRealmResult,
      registerApiLibKeysResult,
      deleteOtherGoalTypes,
      registerPlatformGoalTypesResult,
    };
  } catch (error) {
    console.error('Error encountered while seeding.', error);
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
}

main()
  .then((result) =>
    console.log('Seeding done', JSON.stringify(result, null, 2))
  )
  .catch(() => console.error('Seeding error encountered'));
