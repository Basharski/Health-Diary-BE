// AI-avusteinen: tiedoston sisältöä on tarkennettu Copilotin avulla.
// src/items.js

const items = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' }
];

// 1. Hakee kaikki itemit
const getItems = (req, res) => {
  res.json(items);
};

// 2. UUSI: Hakee vain yhden itemin ID:n perusteella
const getItemById = (req, res, next) => {
  const id = req.params.id; // Napataan ID url-osoitteesta (esim. /api/items/1)
  
  // Etsitään taulukosta item, jonka id täsmää (käytetään == koska urlin id on merkkijono)
  const item = items.find(item => item.id == id);

  if (item) {
    res.json(item); // Jos löytyi, palautetaan se
  } else {
    const error = new Error('Item not found');
    error.status = 404;
    return next(error);
  }
};

// 3. UUSI: Lisää uuden itemin taulukkoon
const postItem = (req, res, next) => {
  const newItem = req.body; // Napataan käyttäjän lähettämä data (esim. { "name": "Orange" })

  if (!newItem || typeof newItem !== 'object') {
    const error = new Error('Missing request body');
    error.status = 400;
    return next(error);
  }
  
  // Generoidaan uudelle itemille ID (katsotaan mikä on listan viimeinen ID ja lisätään 1)
  newItem.id = items.length > 0 ? items[items.length - 1].id + 1 : 1;
  
  // Lisätään (push) uusi item meidän mock data -taulukkoon!
  items.push(newItem);
  
  // Palautetaan 201 Created ja tieto siitä mitä lisättiin
  res.status(201).json({
    message: 'Item created successfully!',
    item: newItem
  });
};

// 4. UUSI: Poistaa oikeasti itemin listalta
const deleteItem = (req, res, next) => {
  const id = req.params.id;
  
  // Etsitään, monennellako sijalla (indeksi) poistettava item on taulukossa
  const index = items.findIndex(item => item.id == id);

  if (index !== -1) {
    // splice() on JavaScriptin tapa poistaa alkio taulukosta tietystä kohdasta
    const deletedItem = items.splice(index, 1);
    
    res.json({ 
      message: `Item ${id} deleted successfully!`,
      deleted: deletedItem[0] 
    });
  } else {
    // Jos annettua ID:tä ei löydy listalta
    const error = new Error('Item not found to delete.');
    error.status = 404;
    return next(error);
  }
};

// 5. UUSI: Päivittää itemin (PUT)
const putItem = (req, res, next) => {
  const id = req.params.id;
  const updatedData = req.body;

  if (!updatedData || typeof updatedData !== 'object') {
    const error = new Error('Missing request body');
    error.status = 400;
    return next(error);
  }

  const index = items.findIndex(item => item.id == id);

  if (index === -1) {
    const error = new Error('Item not found to update.');
    error.status = 404;
    return next(error);
  }

  const updatedItem = {
    ...items[index],
    ...updatedData,
    id: items[index].id
  };

  items[index] = updatedItem;

  res.status(200).json({
    message: `Item ${id} updated successfully!`,
    item: updatedItem
  });
};

export { getItems, getItemById, postItem, putItem, deleteItem };