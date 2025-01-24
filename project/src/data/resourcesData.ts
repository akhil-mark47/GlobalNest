export const visaGuides = [
  {
    id: 1,
    country: 'United States',
    requirements: [
      'Valid passport with at least 6 months validity',
      'Completed DS-160 form',
      'SEVIS payment receipt',
      'I-20 form from university',
      'Financial documents showing sufficient funds',
    ],
    processingTime: '2-3 weeks'
  },
  {
    id: 2,
    country: 'United Kingdom',
    requirements: [
      'Valid passport',
      'CAS number from university',
      'Proof of funding for course and living costs',
      'TB test results (if applicable)',
      'English language proficiency proof'
    ],
    processingTime: '3-4 weeks'
  },
  {
    id: 3,
    country: 'Canada',
    requirements: [
      'Valid passport',
      'Letter of acceptance from university',
      'Proof of financial support',
      'Statement of purpose',
      'Biometrics'
    ],
    processingTime: '4-8 weeks'
  }
];

export const packingGuides = [
  {
    id: 1,
    title: 'Essential Documents',
    items: [
      'Passport and visa documents',
      'University acceptance letter',
      'Insurance documents',
      'Birth certificate (certified copy)',
      'Medical records and prescriptions',
      'International driving permit'
    ]
  },
  {
    id: 2,
    title: 'Academic Materials',
    items: [
      'Laptop and charger',
      'Portable hard drive',
      'Basic stationery',
      'Calculator (if required)',
      'Academic transcripts',
      'Language certificates'
    ]
  },
  {
    id: 3,
    title: 'Personal Items',
    items: [
      'Weather-appropriate clothing',
      'Medications and prescriptions',
      'Basic first-aid kit',
      'Power adapters',
      'Photos of family and friends',
      'Small items from home'
    ]
  },
  {
    id: 4,
    title: 'Financial Preparation',
    items: [
      'International credit/debit cards',
      'Some local currency',
      'Student banking documents',
      'Emergency cash',
      'Scholarship/funding documentation',
      'Budget planning worksheet'
    ]
  }
];

export const countryGuides = [
  {
    id: 1,
    name: 'United States',
    banking: 'Major banks include Chase, Bank of America, and Wells Fargo. Students typically need their passport, I-20, and proof of address to open an account. Many universities have partner banks that offer student-specific accounts.',
    healthcare: 'Most universities require international students to have health insurance. University health centers provide basic care, while hospitals handle emergencies. Keep your insurance card with you at all times.'
  },
  {
    id: 2,
    name: 'United Kingdom',
    banking: 'Popular banks include Barclays, HSBC, and Santander. You\'ll need your passport, BRP card, and proof of address to open an account. Many banks offer specific international student accounts.',
    healthcare: 'Register with a local GP (doctor) once you arrive. The NHS provides most services free of charge, but you may need to pay the Immigration Health Surcharge as part of your visa application.'
  },
  {
    id: 3,
    name: 'Canada',
    banking: 'Major banks include RBC, TD, and Scotiabank. Bring your study permit, passport, and university acceptance letter to open an account. Many banks offer no-fee student accounts.',
    healthcare: 'Most provinces provide health coverage for international students. Apply for your health insurance card soon after arrival. University health services provide primary care.'
  },
  {
    id: 4,
    name: 'Australia',
    banking: 'Commonwealth Bank, ANZ, and Westpac are major banks. You\'ll need your passport, student visa, and enrollment proof to open an account. Many banks allow you to start the process online before arriving.',
    healthcare: 'Overseas Student Health Cover (OSHC) is mandatory. This covers basic medical and hospital care. Register with a local GP for regular healthcare needs.'
  }
];