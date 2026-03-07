import { Product } from './types';

// --- IMAGE IMPORTS ---
// Bangles (23 total)
import b1 from './images/Kundan_Bangels/Kundan_Bangels1.png';
import b2 from './images/Kundan_Bangels/Kundan_Bangels2.png';
import b3 from './images/Kundan_Bangels/Kundan_Bangels3.png';
import b4 from './images/Kundan_Bangels/Kundan_Bangels4.png';
import b5 from './images/Kundan_Bangels/Kundan_Bangels5.png';
import b6 from './images/Kundan_Bangels/Kundan_Bangels6.png';
import b7 from './images/Kundan_Bangels/Kundan_Bangels7.png';
import b8 from './images/Kundan_Bangels/Kundan_Bangels8.png';
import b9 from './images/Kundan_Bangels/Kundan_Bangels9.png';
import b10 from './images/Kundan_Bangels/Kundan_Bangels10.png';
import b11 from './images/Kundan_Bangels/Kundan_Bangels11.png';
import b12 from './images/Kundan_Bangels/Kundan_Bangels12.jpg';
import b13 from './images/Kundan_Bangels/Kundan_Bangels13.png';
import b14 from './images/Kundan_Bangels/Kundan_Bangels14.png';
import b15 from './images/Kundan_Bangels/Kundan_Bangels15.png';
import b16 from './images/Kundan_Bangels/Kundan_Bangels16.png';
import b17 from './images/Kundan_Bangels/Kundan_Bangels17.png';
import b18 from './images/Kundan_Bangels/Kundan_Bangels18.png';
import b19 from './images/Kundan_Bangels/Kundan_Bangels19.png';
import b20 from './images/Kundan_Bangels/Kundan_Bangels20.png';
import b21 from './images/Kundan_Bangels/Kundan_Bangels21.png';
import b22 from './images/Kundan_Bangels/Kundan_Bangels22.png';
import b23 from './images/Kundan_Bangels/Kundan_Bangels23.png';

// Studs (9)
import s1 from './images/studs/studs1.png'; import s2 from './images/studs/studs2.png';
import s3 from './images/studs/studs3.jpg'; import s4 from './images/studs/studs4.jpg';
import s5 from './images/studs/studs5.jpg'; import s6 from './images/studs/studs6.jpg';
import s7 from './images/studs/studs7.jpg'; import s8 from './images/studs/studs8.jpg';
import s9 from './images/studs/studs9.jpg';

// Jhumkas (7)
import j1 from './images/kundan_jhumkas/kundan_jhumkas1.png'; import j2 from './images/kundan_jhumkas/kundan_jhumkas2.png';
import j3 from './images/kundan_jhumkas/kundan_jhumkas3.png'; import j4 from './images/kundan_jhumkas/kundan_jhumkas4.png';
import j5 from './images/kundan_jhumkas/kundan_jhumkas5.png'; import j6 from './images/kundan_jhumkas/kundan_jhumkas6.jpg';
import j7 from './images/kundan_jhumkas/kundan_jhumkas7.png';

// Modern Jhumkas (9)
import mj1 from './images/kundan_modern_earings/kundan_modern_earings1.png'; import mj2 from './images/kundan_modern_earings/kundan_modern_earings2.png';
import mj3 from './images/kundan_modern_earings/kundan_modern_earings3.png'; import mj4 from './images/kundan_modern_earings/kundan_modern_earings4.png';
import mj5 from './images/kundan_modern_earings/kundan_modern_earings5.png'; import mj6 from './images/kundan_modern_earings/kundan_modern_earings6.png';
import mj7 from './images/kundan_modern_earings/kundan_modern_earings7.png'; import mj8 from './images/kundan_modern_earings/kundan_modern_earings8.png';
import mj9 from './images/kundan_modern_earings/kundan_modern_earings9.png';

// Silk Thread Jhumkas (15)
import st1 from './images/silk_thread_jhumkas/silk_thread_jhumkas1.png'; import st2 from './images/silk_thread_jhumkas/silk_thread_jhumkas2.png';
import st3 from './images/silk_thread_jhumkas/silk_thread_jhumkas3.jpeg'; import st4 from './images/silk_thread_jhumkas/silk_thread_jhumkas4.jpeg';
import st5 from './images/silk_thread_jhumkas/silk_thread_jhumkas5.jpeg'; import st6 from './images/silk_thread_jhumkas/silk_thread_jhumkas6.jpeg';
import st7 from './images/silk_thread_jhumkas/silk_thread_jhumkas7.jpeg'; import st8 from './images/silk_thread_jhumkas/silk_thread_jhumkas8.jpeg';
import st9 from './images/silk_thread_jhumkas/silk_thread_jhumkas9.jpeg'; import st10 from './images/silk_thread_jhumkas/silk_thread_jhumkas10.jpeg';
import st11 from './images/silk_thread_jhumkas/silk_thread_jhumkas11.jpeg'; import st12 from './images/silk_thread_jhumkas/silk_thread_jhumkas12.jpeg';
import st13 from './images/silk_thread_jhumkas/silk_thread_jhumkas13.jpeg'; import st14 from './images/silk_thread_jhumkas/silk_thread_jhumkas14.jpeg';
import st15 from './images/silk_thread_jhumkas/silk_thread_jhumkas15.jpeg';

// Traditional Jhumkas (6)
import tj1 from './images/traditional_jhumkas/traditional_jhumkas1.png'; import tj2 from './images/traditional_jhumkas/traditional_jhumkas2.png';
import tj3 from './images/traditional_jhumkas/traditional_jhumkas3.png'; import tj4 from './images/traditional_jhumkas/traditional_jhumkas4.png';
import tj5 from './images/traditional_jhumkas/traditional_jhumkas5.png'; import tj6 from './images/traditional_jhumkas/traditional_jhumkas6.png';

export function generateShopProducts(): Product[] {
  const allProducts: Product[] = [];

  // Data mapping
  const bangleImages = [b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11,b12,b13,b14,b15,b16,b17,b18,b19,b20,b21,b22,b23];
  const studImages = [s1,s2,s3,s4,s5,s6,s7,s8,s9];
  const jhumkaImages = [j1,j2,j3,j4,j5,j6,j7];
  const modernJhumkaImages = [mj1,mj2,mj3,mj4,mj5,mj6,mj7,mj8,mj9];
  const silkJhumkaImages = [st1,st2,st3,st4,st5,st6,st7,st8,st9,st10,st11,st12,st13,st14,st15];
  const tradJhumkaImages = [tj1,tj2,tj3,tj4,tj5,tj6];

  // Populate Bangles (23 images split into 3 types)
  bangleImages.forEach((img, i) => {
    let type = 'Traditional';
    if (i >= 8 && i < 16) type = 'Modern';
    if (i >= 16) type = 'Bridal';
    allProducts.push({
      id: `bang-${i}`,
      name: `Kundan Bangle ${i + 1}`,
      category: 'Bangles',
      subCategory: type,
      price: 850 + (i * 20),
      image: img,
      images: [img],
      sizes: ['2.4', '2.6', '2.8'],
      description: 'Exquisite handcrafted kundan bangles.',
      trending: i < 4,
      topSelling: i < 3 || (i >= 8 && i < 11),
      newArrival: i >= 15 && i < 20,
      under500: i % 3 === 0,
      inStock: !(i === 5 || i === 15) // Only mark 2 items as out of stock
    });
  });

  // Populate Earrings
  const addE = (imgs: any[], sub: string, pref: string) => {
    imgs.forEach((img, i) => {
      allProducts.push({
        id: `${pref}-${i}`,
        name: `${sub} ${i + 1}`,
        category: 'Earrings',
        subCategory: sub,
        price: 350 + (i * 15),
        image: img,
        images: [img],
        description: `Beautiful ${sub} earrings.`,
        trending: i < 3,
        topSelling: i < 2 || (i >= 4 && i < 6),
        newArrival: true,
        under500: i % 2 === 0,
        inStock: !(i === 3 || i === 8) // Only mark 2 items per category as out of stock
      });
    });
  };

  addE(studImages, 'Studs', 'std');
  addE(jhumkaImages, 'Jhumkas', 'jhm');
  addE(modernJhumkaImages, 'Modern Jhumkas', 'mjh');
  addE(silkJhumkaImages, 'Silk Thread Jhumkas', 'sjh');
  addE(tradJhumkaImages, 'Traditional Jhumkas', 'tjh');

  return allProducts;
}

// Export pre-generated products
export const shopProducts = generateShopProducts();
