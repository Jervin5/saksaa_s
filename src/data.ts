import { Product, FAQ } from './types';

import bangle1 from './images/Kundan_Bangels/Kundan_Bangels1.png'
import bangle2 from './images/Kundan_Bangels/Kundan_Bangels11.png'
import bangle3 from './images/Kundan_Bangels/Kundan_Bangels12.jpg'

import earring1 from './images/silk_thread_jhumkas/silk_thread_jhumkas2.png'
import earring2 from './images/silk_thread_jhumkas/silk_thread_jhumkas3.jpeg'

import bangle4 from './images/Kundan_Bangels/Kundan_Bangels7.png'
import bangle5 from './images/Kundan_Bangels/Kundan_Bangels8.png'

import stud1 from './images/studs/studs1.png'
import stud2 from './images/studs/studs2.png'

import bangle6 from './images/Kundan_Bangels/Kundan_Bangels14.png'
import bangle7 from './images/Kundan_Bangels/Kundan_Bangels15.png'
import bangle8 from './images/Kundan_Bangels/Kundan_Bangels16.png'

import earring3 from './images/kundan_jhumkas/kundan_jhumkas3.png'
import earring4 from './images/kundan_jhumkas/kundan_jhumkas4.png'

import bangle9 from './images/Kundan_Bangels/Kundan_Bangels18.png'
import bangle10 from './images/Kundan_Bangels/Kundan_Bangels19.png'

export const products: Product[] = [
  {
    id: '1',
    name: 'Royal Gold Plated Bangles',
    price: 1250,
    category: 'Bangles',
    subCategory: 'Traditional',
    image: bangle1,
    images: [
      bangle2,
      bangle3
    ],
    description: 'Exquisite gold-plated bangles handcrafted with intricate traditional patterns. Perfect for weddings and festive occasions.',
    trending: true,
    topSelling: true,
    sizes: ['2.2', '2.4', '2.6', '2.8'],
    inStock: true
  },
  {
    id: '2',
    name: 'Kundan Jhumka Earrings',
    price: 850,
    category: 'Earrings',
    subCategory: 'Jhumkas',
    image: earring1,
    images: [
      earring2
    ],
    description: 'Elegant Kundan jhumkas with pearl drops. A timeless piece that adds grace to any ethnic outfit.',
    trending: true,
    newArrival: true,
    inStock: true
  },
  {
    id: '3',
    name: 'Kundan Chandni Bangles',
    price: 2450,
    category: 'Bangles',
    subCategory: 'Kundan',
    image: bangle6,
    images: [
      bangle7,
      bangle8
    ],
    description: 'Exquisite Kundan work bangles with traditional chandni patterns. A showstopper for weddings and special occasions.',
    topSelling: true,
    trending: true,
    sizes: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    inStock: false
  },
  {
    id: '5',
    name: 'Silver Oxidized Bangles',
    price: 499,
    category: 'Bangles',
    subCategory: 'Oxidized',
    image: bangle4,
    images: [
      bangle5
    ],
    description: 'Bohemian style silver oxidized bangles. Versatile and trendy for daily wear.',
    under500: true,
    trending: true,
    sizes: ['2.4', '2.6', '2.8', '2.10'],
    inStock: true
  },
  {
    id: '6',
    name: 'Pearl Stud Earrings',
    price: 350,
    category: 'Earrings',
    subCategory: 'Studs',
    image: stud1,
    images: [
      stud2
    ],
    description: 'Classic pearl studs that never go out of style. Simple yet sophisticated.',
    under500: true,
    topSelling: true,
    inStock: true
  },
  {
    id: '7',
    name: 'Meenakari Hanging Earrings',
    price: 1850,
    category: 'Earrings',
    subCategory: 'Hanging',
    image: bangle9,
    images: [
      bangle10
    ],
    description: 'Vibrant Meenakari work hanging earrings with intricate colorful patterns. A burst of traditional elegance for your style.',
    newArrival: true,
    trending: true,
    inStock: true
  }
];

export const faqs: FAQ[] = [
  {
    question: 'What are the shipping charges?',
    answer: 'We offer free shipping on orders above ₹1,500. For orders below that, a flat shipping fee of ₹100 is applicable across India.'
  },
  {
    question: 'Do you deliver across India?',
    answer: 'Yes, we deliver to almost all pin codes in India through our reliable courier partners.'
  },
  {
    question: 'Is international delivery available?',
    answer: 'Currently, we only ship within India. We are working on expanding our reach internationally soon.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We have a 7-day return policy for damaged or incorrect items. Please ensure the product is unused and in its original packaging.'
  },
  {
    question: 'How to measure bangle size?',
    answer: 'You can measure the inner diameter of an existing bangle or use a measuring tape around your knuckles. Refer to our size chart for more details.'
  },
  {
    question: 'What is the order confirmation process?',
    answer: 'Once you place an order, you will receive an email and WhatsApp confirmation with your order details and tracking link.'
  },
  {
    question: 'How to order a customised set?',
    answer: 'Visit our "Customise Your Set" page, select your preferences, upload your outfit photo, and place the order. Our team will contact you for further details.'
  },
  {
    question: 'Is COD (Cash on Delivery) available?',
    answer: 'Yes, COD is available for orders up to ₹5,000. For higher amounts, we require prepaid payments.'
  },
  {
    question: 'What are the payment options?',
    answer: 'We accept all major Credit/Debit cards, UPI, Net Banking, and popular wallets like GPay and Paytm.'
  }
];
