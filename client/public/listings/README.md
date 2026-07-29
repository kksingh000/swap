# Real listing photos

Drop image files here (jpg / png / webp) to use them as real listing photos.

Vite serves this folder at the site root, so a file saved as:

    client/public/listings/mens-navy-knit.jpg

is reachable in the app at:

    /listings/mens-navy-knit.jpg

## How to use

1. Save your image files into this folder. Use short, descriptive names
   (e.g. `converse-cream.jpg`, `mens-suede-jacket.jpg`).
2. Tell Claude the filenames and which listing each belongs to
   (or just "use these for the newest men's pieces").
3. Claude wires each file to that listing's `image` field in
   `client/src/data/seed.js` — the exact photo then renders on the card
   and detail page.

Only use photos you have the right to use. Avoid press/editorial shots of
identifiable people; plain garment / product shots are ideal.
