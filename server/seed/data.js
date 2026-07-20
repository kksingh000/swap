// Mirror of the client seed catalogue — same people, same 26 pieces.
const P = '?w=900&q=80&auto=format&fit=crop'
const img = (id) => `https://images.unsplash.com/${id}${P}`

export const seedUsers = [
  { key: 'u-01', name: 'Ananya Sharma', email: 'ananya@swap.in', city: 'New Delhi', rating: 4.9, swapsCompleted: 23 },
  { key: 'u-02', name: 'Rohan Mehta', email: 'rohan@swap.in', city: 'Mumbai', rating: 4.7, swapsCompleted: 17 },
  { key: 'u-03', name: 'Priya Nair', email: 'priya@swap.in', city: 'Bengaluru', rating: 5.0, swapsCompleted: 31 },
  { key: 'u-04', name: 'Arjun Malhotra', email: 'arjun@swap.in', city: 'Gurugram', rating: 4.5, swapsCompleted: 9 },
  { key: 'u-05', name: 'Sana Qureshi', email: 'sana@swap.in', city: 'Jaipur', rating: 4.8, swapsCompleted: 14 },
  { key: 'u-06', name: 'Vikram Iyer', email: 'vikram@swap.in', city: 'Noida', rating: 4.6, swapsCompleted: 12 },
]

export const seedListings = [
  { itemId: 'SW-1042', title: 'Trucker Jacket, Washed Indigo', brand: "Levi's", category: 'Denim', size: 'M', condition: 'Gently used', city: 'New Delhi', owner: 'u-01', listedAt: '2026-07-02', image: img('photo-1611312449408-fcece27cdbb7'), description: 'Classic Type III trucker in a mid-indigo wash. Worn maybe a dozen winter-market evenings; no fraying, buttons intact.' },
  { itemId: 'SW-1087', title: 'Wool-Blend Double-Breasted Overcoat', brand: 'Zara', category: 'Outerwear', size: 'L', condition: 'Like new', city: 'Mumbai', owner: 'u-02', listedAt: '2026-07-08', image: img('photo-1539533113208-f6df8cc8b543'), description: 'Charcoal overcoat from the 2025 winter drop. Worn twice to office dinners — too warm for Mumbai.' },
  { itemId: 'SW-1120', title: "Air Force 1 '07, Triple White", brand: 'Nike', category: 'Footwear', size: 'UK 9', condition: 'Gently used', city: 'Bengaluru', owner: 'u-03', listedAt: '2026-07-11', image: img('photo-1600269452121-4f2416e55c28'), description: 'Cleaned and re-laced. Light creasing on the toe box, soles at 85%. Comes with the original box.' },
  { itemId: 'SW-1156', title: 'Hand Block-Print Cotton Kurta', brand: 'FabIndia', category: 'Ethnic', size: 'S', condition: 'Like new', city: 'Jaipur', owner: 'u-05', listedAt: '2026-07-05', image: img('photo-1727835523545-70ee992b5763'), description: 'Sanganeri block print in madder red on off-white. Worn once over a lehenga skirt.' },
  { itemId: 'SW-1198', title: 'Ribbed Merino Turtleneck', brand: 'H&M', category: 'Knitwear', size: 'M', condition: 'New with tags', city: 'Pune', owner: 'u-04', listedAt: '2026-07-13', image: img('photo-1688685567139-70841b903f18'), description: 'Black ribbed knit, tags still on.' },
  { itemId: 'SW-1203', title: 'Slim-Fit Oxford Shirt, Sky Stripe', brand: 'Tommy Hilfiger', category: 'Shirts', size: 'L', condition: 'Gently used', city: 'Gurugram', owner: 'u-04', listedAt: '2026-06-28', image: img('photo-1618786177957-29d9b6b26d8a'), description: 'Blue-and-white stripe oxford, flag embroidery at the chest. Collar shows no wear.' },
  { itemId: 'SW-1244', title: 'Chanderi Anarkali Set with Dupatta', brand: 'Biba', category: 'Ethnic', size: 'M', condition: 'Like new', city: 'Lucknow', owner: 'u-05', listedAt: '2026-07-01', image: img('photo-1744833341427-6f2b4eac91ff'), description: 'Deep maroon chanderi with gold-thread border. Worn once for Diwali 2025.' },
  { itemId: 'SW-1261', title: 'Samba OG, Black Gum Sole', brand: 'Adidas', category: 'Footwear', size: 'UK 8', condition: 'Well loved', city: 'Hyderabad', owner: 'u-02', listedAt: '2026-06-20', image: img('photo-1718220130188-428c7dc27fd2'), description: 'The pair that went everywhere. Suede toe scuffed, gum sole has life left. Priced honestly.' },
  { itemId: 'SW-1290', title: 'Ultra Light Down Vest, Olive-Grey', brand: 'Uniqlo', category: 'Outerwear', size: 'M', condition: 'Gently used', city: 'Noida', owner: 'u-06', listedAt: '2026-07-10', image: img('photo-1636529109797-0749811c4916'), description: 'Packs into its own pouch. Perfect Delhi-winter layering piece.' },
  { itemId: 'SW-1315', title: 'Satin Slip Dress, Midnight', brand: 'Mango', category: 'Dresses', size: 'S', condition: 'Like new', city: 'Mumbai', owner: 'u-03', listedAt: '2026-07-09', image: img('photo-1656284518334-710b60cd63a0'), description: 'Bias-cut satin slip in true black. Worn to one reception.' },
  { itemId: 'SW-1348', title: 'Merino V-Neck Sweater, Camel', brand: 'Raymond', category: 'Knitwear', size: 'XL', condition: 'Gently used', city: 'Chandigarh', owner: 'u-06', listedAt: '2026-06-25', image: img('photo-1670080589800-6416c8ce8a14'), description: 'Fine-gauge merino, dry-cleaned before listing.' },
  { itemId: 'SW-1372', title: 'Slim Jeans, Raw Selvedge', brand: 'Jack & Jones', category: 'Denim', size: '32', condition: 'Gently used', city: 'New Delhi', owner: 'u-01', listedAt: '2026-07-14', image: img('photo-1725387072845-7431bbc453bc'), description: 'Dark raw denim, hemmed to a 30-inch inseam.' },
  { itemId: 'SW-1391', title: 'Faux-Leather Biker Jacket', brand: 'Zara', category: 'Outerwear', size: 'M', condition: 'Gently used', city: 'Pune', owner: 'u-03', listedAt: '2026-07-06', image: img('photo-1551028719-00167b16eac5'), description: 'Asymmetric zip, quilted shoulders, zero peeling.' },
  { itemId: 'SW-1404', title: 'Chikankari Straight Kurta, White', brand: 'W for Woman', category: 'Ethnic', size: 'L', condition: 'Like new', city: 'Lucknow', owner: 'u-05', listedAt: '2026-07-12', image: img('photo-1745313452052-0e4e341f326c'), description: 'Hand-embroidered Lucknowi chikankari on mul cotton.' },
  { itemId: 'SW-1419', title: 'Dri-FIT Running Tee, Graphite', brand: 'Nike', category: 'Tees', size: 'M', condition: 'Gently used', city: 'Bengaluru', owner: 'u-03', listedAt: '2026-07-03', image: img('photo-1695918428487-7934244c19ac'), description: 'Breathable knit, retired only because I sized up.' },
  { itemId: 'SW-1433', title: 'Pebbled Leather Shoulder Bag, Tan', brand: 'Coach', category: 'Accessories', size: 'One size', condition: 'Like new', city: 'Mumbai', owner: 'u-02', listedAt: '2026-07-07', image: img('photo-1598532163257-ae3c6b2524b6'), description: 'Pebbled leather, brass hardware, kept in its dust bag.' },
  { itemId: 'SW-1450', title: 'Linen-Blend Resort Shirt, Sand', brand: 'H&M', category: 'Shirts', size: 'M', condition: 'Like new', city: 'Goa', owner: 'u-04', listedAt: '2026-07-04', image: img('photo-1740711152088-88a009e877bb'), description: 'Relaxed camp collar, worn to exactly one beach wedding.' },
  { itemId: 'SW-1467', title: 'Ultra Stretch Skinny Jeans, Ink', brand: 'Uniqlo', category: 'Denim', size: '30', condition: 'Like new', city: 'Noida', owner: 'u-06', listedAt: '2026-07-13', image: img('photo-1602293589930-45aad59ba3ab'), description: 'Deep ink-blue with real stretch recovery.' },
  { itemId: 'SW-1478', title: 'Floral Wrap Dress, Terracotta', brand: 'Forever 21', category: 'Dresses', size: 'S', condition: 'Gently used', city: 'Jaipur', owner: 'u-05', listedAt: '2026-06-29', image: img('photo-1496747611176-843222e1e57c'), description: 'True wrap silhouette, hem professionally re-stitched.' },
  { itemId: 'SW-1495', title: '574 Core, Grey Suede', brand: 'New Balance', category: 'Footwear', size: 'UK 10', condition: 'Gently used', city: 'Chandigarh', owner: 'u-06', listedAt: '2026-07-08', image: img('photo-1551107696-a4b0c5a0d9a2'), description: 'Suede brushed clean, fresh insoles.' },
  { itemId: 'SW-1512', title: 'Cable-Knit Cotton Sweater, Cream', brand: 'Ralph Lauren', category: 'Knitwear', size: 'L', condition: 'Like new', city: 'Gurugram', owner: 'u-04', listedAt: '2026-07-11', image: img('photo-1610901157620-340856d0a50f'), description: 'The iconic Aran cable, stored with cedar blocks.' },
  { itemId: 'SW-1529', title: 'Pleated Satin Midi Skirt, Slate', brand: 'Mango', category: 'Dresses', size: 'S', condition: 'New with tags', city: 'Mumbai', owner: 'u-03', listedAt: '2026-07-15', image: img('photo-1533659828870-95ee305cee3e'), description: 'Knife pleats, tags attached.' },
  { itemId: 'SW-1536', title: 'Silk-Blend Nehru Jacket, Charcoal', brand: 'FabIndia', category: 'Ethnic', size: 'M', condition: 'Like new', city: 'New Delhi', owner: 'u-01', listedAt: '2026-07-09', image: img('photo-1618998300304-66165e377760'), description: 'Mandarin collar, horn buttons, worn at two receptions.' },
  { itemId: 'SW-1541', title: 'Firebird Track Jacket, Black', brand: 'Adidas', category: 'Outerwear', size: 'S', condition: 'Gently used', city: 'Hyderabad', owner: 'u-02', listedAt: '2026-06-26', image: img('photo-1768983953826-231e8ef0b6dc'), description: 'Classic three-stripe Firebird, embroidery sharp.' },
  { itemId: 'SW-1558', title: '501 Original, Stonewash', brand: "Levi's", category: 'Denim', size: '34', condition: 'Well loved', city: 'Mumbai', owner: 'u-02', listedAt: '2026-06-22', image: img('photo-1584370848010-d7fe6bc767ec'), description: 'Broken in exactly how a 501 should be.' },
  { itemId: 'SW-1570', title: 'Cotton Palazzo Set, Indigo Dabu', brand: 'Biba', category: 'Ethnic', size: 'L', condition: 'Gently used', city: 'Lucknow', owner: 'u-05', listedAt: '2026-07-02', image: img('photo-1597983073750-16f5ded1321f'), description: 'Dabu hand-block print, colour still deep.' },
]

// Demo negotiations + disputes (keyed by itemId / user key).
export const seedRequests = [
  { offered: 'SW-1261', requested: 'SW-1042', requester: 'u-02', status: 'Negotiating',
    messages: [
      { from: 'u-02', text: 'Hey! Would you take the Samba OGs for your trucker jacket? Both gently worn.' },
      { from: 'u-01', text: 'Tempting — but the values are a bit apart. Add the H&M beanie you listed and we have a deal.' },
      { from: 'u-02', text: 'Deal. Sending the updated offer now.' },
    ] },
  { offered: 'SW-1372', requested: 'SW-1391', requester: 'u-01', status: 'Requested', messages: [] },
  { offered: 'SW-1536', requested: 'SW-1348', requester: 'u-01', status: 'Completed',
    messages: [
      { from: 'u-06', text: 'Sweater for the Nehru jacket — clean trade, values almost level.' },
      { from: 'u-01', text: 'Done. Rajiv Chowk metro, Saturday noon?' },
    ] },
]

export const seedDisputes = [
  { request: 0, raisedBy: 'u-02', against: 'u-01', reason: 'Jacket has a shoulder-seam pull that was not visible in the listing photos.' },
  { request: 2, raisedBy: 'u-06', against: 'u-01', reason: 'No-show at the agreed metro exchange point, twice in one week.' },
  { request: 1, raisedBy: 'u-03', against: 'u-05', reason: 'Size listed as M but the care label reads S.' },
]
