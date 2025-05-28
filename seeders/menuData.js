const menuData = [
  {
    category: "Classic Pizzas",
    description: "Traditional and classic pizza flavors",
    items: [
      {
        title: "MARGIRITA",
        content: "Tomatensaus, kaas",
        price: "8.95",
        isVegetarian: true
      },
      {
        title: "FUNGHI",
        content: "Tomatensaus, kaas, champignons",
        price: "8.95",
        isVegetarian: true
      },
      {
        title: "PROSCUITTO",
        content: "Tomatensaus, kaas, ham",
        price: "8.95"
      },
      {
        title: "SALAMI",
        content: "Tomatensaus, kaas, salami",
        price: "8.95"
      },
      {
        title: "BOLOGNAISE",
        content: "Bolognaise, kaas, look",
        price: "8.95"
      },
      {
        title: "TONNO",
        content: "Tomatensaus, kaas, tonijn, ui, olijven",
        price: "8.95"
      },
      {
        title: "VEGETARISCH",
        content: "Tomatensaus, kaas, paprika, champignons, mais, ui, olijven",
        price: "8.95",
        isVegetarian: true
      },
      {
        title: "QUATTRO FROMAGGIO",
        content: "Tomatensaus, kaas, vier soorten kaas",
        price: "8.95"
      },
      {
        title: "PEPPERONI",
        content: "Tomatensaus, kaas, pepperoni, maïs pikante pepers",
        price: "8.95"
      },
      {
        title: "MIMOSA",
        content: "Tomatensaus, kaas, ham, tomaat",
        price: "8.95"
      },
      {
        title: "KEBAB",
        content: "Tomatensaus, kaas, kebab",
        price: "8.95"
      },
      {
        title: "QUATTRO STAGIONE",
        content: "Tomatensaus, kaas, champignons, paprika, salami, ham",
        price: "9.95"
      },
      {
        title: "MARGARITA SPECIAAL",
        content: "Tomatensaus, kaas, look, ui, paprika, mozzarella kaas",
        price: "9.95"
      },
      {
        title: "BOLOGNAISE SPECIAAL",
        content: "Bolognaise, look, ui, kaas, pikante peppers",
        price: "9.95"
      },
      {
        title: "KEBAB SPECIAAL",
        content: "Tomatensaus, kaas, kebab, ui, paprika, look",
        price: "9.95"
      },
      {
        title: "RUSTICA",
        content: "Tomatensaus, kaas, ham, salami, ei",
        price: "9.95"
      },
      {
        title: "CALZONE",
        content: "Tomatensaus, kaas, ham, salami, paprika, bolognaise",
        price: "9.95"
      },
      {
        title: "BOLOGNAISE KIP",
        content: "bolognaisesaus, kaas, look, ui, kip",
        price: "9.95"
      },
      {
        title: "POLLO",
        content: "Tomatensaus, kaas, kip, ui, champignons, paprika",
        price: "10.95"
      },
      {
        title: "HAWAI",
        content: "Tomatensaus, kaas, ham, kip, ananas, maïs",
        price: "10.95"
      },
      {
        title: "BBQ KIP",
        content: "Bbq saus, kaas, ui, paprika, kip",
        price: "10.95"
      },
      {
        title: "BBQ GEHAKT",
        content: "Bbq saus, kaas, ui, paprika, gehaktballetjes",
        price: "10.95"
      },
      {
        title: "BBQ BACON",
        content: "Bbq saus, kaas, ui, paprika, bacon, gehakt",
        price: "10.95"
      },
      {
        title: "PIZZA MERGUEZZ",
        content: "Tomatensaus, kaas, ui, paprika, look, merguez, pikante pepers, bbq saus",
        price: "10.95"
      },
      {
        title: "HOT PIZZA",
        content: "Tomatensaus, kaas, peperoni, ui, paprika, pikante pepers",
        price: "10.95"
      },
      {
        title: "ROOM VEGIE",
        content: "Roomsaus, kaas, champignons, ui, paprika, maïs, olijven",
        price: "10.95"
      },
      {
        title: "ROOM BACON",
        content: "Roomsaus, kaas, bacon, ui, paprika",
        price: "10.95"
      },
      {
        title: "ROOME KIP",
        content: "Roomsaus, kaas, paprika, ui, kip",
        price: "10.95"
      },
      {
        title: "CURRY KIP",
        content: "Currysaus, kaas, ui, ananas, kip, mozzarella",
        price: "10.95"
      },
      {
        title: "CURRY KEBAB",
        content: "Currysaus, kaas, ui, paprika, kebab, pikante pepers",
        price: "10.95"
      },
      {
        title: "CURRY VEGIE",
        content: "Currysaus, kaas, ui, champignons, paprika, maïs, olijven",
        price: "10.95"
      },
      {
        title: "CURRY DELUXE",
        content: "Currysaus, kaas, ui, paprika, kip, gehaktballetjes",
        price: "11.95"
      },
      {
        title: "TANDOORI",
        content: "Tomatensaus, kaas, ui, paprika, tandoori kip",
        price: "11.95"
      },
      {
        title: "FRUTTI DI MARE",
        content: "Tomatensaus, kaas, tonijn, scampi's, garnalen, mosselen, calamares",
        price: "11.95"
      },
      {
        title: "FULL OPTION",
        content: "Tomatensaus, kaas, ui, maïs, paprika, salami, bolognaise, kip, olijven",
        price: "11.95"
      },
      {
        title: "PIZZA MIX",
        content: "Tomatensaus, kaas, pitta vlees, kip pikante pepers, ui, champignons",
        price: "11.95"
      },
      {
        title: "BBQ SPECIAAL",
        content: "Bbq saus, kaas, pepperoni, ui, paprika, kip, gehaktballetjes",
        price: "11.95"
      },
      {
        title: "CURRY SPECIAAL",
        content: "Currysaus, kaas, ham, gehaktballetjes, ui, paprika, kip, mozzarella",
        price: "11.95"
      },
      {
        title: "PIZZA SCAMPI'S",
        content: "Tomatensaus, kaas, ui, paprika, scampi's",
        price: "11.95"
      },
      {
        title: "PIZZA HUSREV",
        content: "Tomatensaus, kaas, peperoni, salami, ham, paprika, gehaktballetjes, kip, olijven",
        price: "11.95"
      }
    ]
  },
  {
    category: "Pasta's",
    description: "We bieden een verscheidenheid aan pasta's, ontdek ons menu",
    items: [
      {
        title: "PASTA BOLOGNAISE",
        content: "Bolognaisesaus, kaas",
        price: "11.00"
      },
      {
        title: "PASTA FUNGI",
        content: "Roomsaus, kaas, champignons",
        price: "11.00"
      },
      {
        title: "PASTA CARBONARA",
        content: "Roomsaus, kaas, spek, tomatensaus",
        price: "11.00"
      },
      {
        title: "PASTA POLLO",
        content: "Roomsaus, kaas, kip",
        price: "11.00"
      },
      {
        title: "PASTA VEGETARIAN",
        content: "Roomsaus, kaas, groenten",
        price: "11.00"
      },
      {
        title: "PASTA QUATTRO FROMAGGIO",
        content: "Roomsaus, vier soorten kaas",
        price: "11.00"
      },
      {
        title: "PASTA DIABOLIQUE",
        content: "Roomsaus, kaas, scampi's tomatensaus",
        price: "12.00"
      },
      {
        title: "PASTA SPECIAL",
        content: "Roomsaus, kaas, spek, kip, ei",
        price: "12.00"
      },
      {
        title: "PASTA CHICKEN",
        content: "Roomsaus, kaas, kip pesto",
        price: "12.00"
      },
      {
        title: "PASTA CURRY",
        content: "Roomsaus, ananas, maïs, ui, kip, gehaktballetjes, currysaus",
        price: "12.00"
      },
      {
        title: "PASTA HUSREV",
        content: "Roomsaus, ui, paprika, kip, gehaktballetjes",
        price: "12.00"
      },
      {
        title: "PASTA FRUTTI DI MARE",
        content: "Roomsaus, tomatensaus, zeevruchten",
        price: "12.00"
      },
      {
        title: "PASTA ROMANA",
        content: "Roomsaus, kaas, kip, ui, champignons",
        price: "12.00"
      }
    ]
  },
  {
    category: "Pitta Brood",
    description: "Turkse Kebab En Brood",
    items: [
      {
        title: "Schotel Pitta",
        content: "Brood, Pitta Vlees, Keuze Van saus en Groentjes",
        price: "7.00"
      },
      {
        title: "Brood Kip",
        content: "Brood, Pitta Kip, Keuze Van saus en Groentjes",
        price: "7.00"
      },
      {
        title: "Brood Mix",
        content: "Brood, Pitta Vlees en kip, Keuze Van saus en Salade",
        price: "7.00"
      },
      {
        title: "VEGETARISCH Brood",
        content: "Brood, FetaKaas, Keuze Van saus en Groentjes",
        price: "6.00"
      }
    ]
  },
  {
    category: "Schotels",
    description: "Pitta Vlees, Frietjes, Keuze Van saus en Groentjes",
    items: [
      {
        title: "Schotel Pitta",
        content: "Brood, Pitta Vlees, Keuze Van saus en Groentjes",
        price: "11.00"
      },
      {
        title: "Schotel Kip",
        content: "Frietjes, Kip, Keuze Van saus en Groentjes",
        price: "11.00"
      },
      {
        title: "Schotel Mix",
        content: "Pitta Vlees en Kip, Frietjes, Keuze Van saus en Groentjes",
        price: "11.00"
      },
      {
        title: "Schotel Mexicano",
        content: "Mexicano, Frietjes, Keuze Van saus en Groentjes",
        price: "11.00"
      },
      {
        title: "Schotel Hamburger",
        content: "Hamburger, Frietjes, Keuze Van saus en Groentjes",
        price: "11.00"
      },
      {
        title: "Schotel Frikandel",
        content: "Frikandel, Frietjes, Keuze Van saus en Groentjes",
        price: "11.00"
      },
      {
        title: "Schotel Vegetarisch",
        content: "Fetakaas, Frietjes, Keuze Van saus en Groentjes",
        price: "10.00"
      },
      {
        title: "Schotel Kipsate",
        content: "Kipsate, Frietjes, Keuze Van saus en Groentjes",
        price: "13.00"
      },
      {
        title: "Schotel Apirio",
        content: "Apirio, Frietjes, Keuze Van saus en Groentjes",
        price: "13.00"
      },
      {
        title: "Schotel Husrev",
        content: "Grill Kipfilet, Frietjes, Keuze Van saus en Groentjes",
        price: "13.00"
      },
      {
        title: "Schotel Kofte",
        content: "Kofte, Frietjes, Keuze Van saus en Groentjes",
        price: "13.00"
      },
      {
        title: "Schotel Adana",
        content: "Adana, Frietjes, Keuze Van saus en Groentjes",
        price: "13.00"
      }
    ]
  },
  {
    category: "Durum",
    description: "Heerlijke wraps met verschillende vullingen",
    items: [
      {
        title: "Durum Pitta",
        content: "Wrap, Vlees, Keuze Van saus en Groentjes",
        price: "8.00"
      },
      {
        title: "Durum Kip",
        content: "Wrap, Keuze Van saus en Groentjes",
        price: "8.00"
      },
      {
        title: "Durum Mix",
        content: "Wrap Vlees en Kip, Keuze Van saus en Groentjes",
        price: "8.00"
      },
      {
        title: "Durum Firkandel",
        content: "Wrap, Frikandel, Keuze Van saus en Groentjes",
        price: "8.00"
      },
      {
        title: "Durum Hamburger",
        content: "Wrap, Hamburger, Keuze Van saus en Groentjes",
        price: "8.00"
      },
      {
        title: "Durum Mexicano",
        content: "Wrap, Mexicano, Keuze Van saus en Groentjes",
        price: "8.00"
      },
      {
        title: "Durum Kofte",
        content: "Wrap Kofte, Keuze Van saus en Groentjes",
        price: "9.00"
      },
      {
        title: "Durum Adana",
        content: "Wrap, Adana, Keuze Van saus en Groentjes",
        price: "9.00"
      },
      {
        title: "Durum Kipcorn",
        content: "Wrap, Kipcorn, Keuze Van saus en Groentjes",
        price: "10.00"
      },
      {
        title: "Durum Kipsate",
        content: "Wrap, Kipsate, Keuze Van saus en Groentjes",
        price: "10.00"
      },
      {
        title: "Durum Vegetarisch",
        content: "Wrap, Fetakaas, Frietjes, Keuze Van saus en Groentjes",
        price: "10.00"
      }
    ]
  },
  {
    category: "Specialty Pizzas",
    description: "Unique and special pizza combinations",
    items: [
      {
        title: "QUATTRO FROMAGGIO",
        content: "Tomatensaus, kaas, vier soorten kaas",
        price: "9.95",
        isVegetarian: true
      },
      {
        title: "PEPPERONI",
        content: "Tomatensaus, kaas, pepperoni, maïs pikante pepers",
        price: "9.95",
        isSpicy: true
      },
      {
        title: "MIMOSA",
        content: "Tomatensaus, kaas, ham, tomaat",
        price: "9.95"
      },
      {
        title: "KEBAB",
        content: "Tomatensaus, kaas, kebab",
        price: "9.95"
      },
      {
        title: "QUATTRO STAGIONE",
        content: "Tomatensaus, kaas, champignons, paprika, salami, ham",
        price: "9.95"
      }
    ]
  },
  {
    category: "Vegetarian Pizzas",
    description: "Delicious vegetarian pizza options",
    items: [
      {
        title: "VEGETARISCH",
        content: "Tomatensaus, kaas, paprika, champignons, mais, ui, olijven",
        price: "8.95",
        isVegetarian: true
      },
      {
        title: "ROOM VEGIE",
        content: "Roomsaus, kaas, champignons, ui, paprika, maïs, olijven",
        price: "10.95",
        isVegetarian: true
      },
      {
        title: "CURRY VEGIE",
        content: "Currysaus, kaas, ui, champignons, paprika, maïs, olijven",
        price: "10.95",
        isVegetarian: true
      }
    ]
  },
  {
    category: "Spicy Pizzas",
    description: "Hot and spicy pizza varieties",
    items: [
      {
        title: "HOT PIZZA",
        content: "Tomatensaus, kaas, peperoni, ui, paprika, pikante pepers",
        price: "10.95",
        isSpicy: true
      },
      {
        title: "PIZZA MERGUEZZ",
        content: "Tomatensaus, kaas, ui, paprika, look, merguez, pikante pepers, bbq saus",
        price: "10.95",
        isSpicy: true
      },
      {
        title: "CURRY KEBAB",
        content: "Currysaus, kaas, ui, paprika, kebab, pikante pepers",
        price: "10.95",
        isSpicy: true
      }
    ]
  },
  {
    category: "Desserts",
    description: "Sweet treats and desserts",
    items: [
      {
        title: "Tiramisu",
        content: "Classic Italian dessert with coffee-soaked ladyfingers",
        price: "6.95"
      },
      {
        title: "Chocolate Cake",
        content: "Rich chocolate cake with chocolate ganache",
        price: "5.95"
      },
      {
        title: "Ice Cream",
        content: "Vanilla ice cream with chocolate sauce",
        price: "4.95"
      }
    ]
  },
  {
    category: "Drinks",
    description: "Refreshing beverages",
    items: [
      {
        title: "Cola",
        content: "Classic cola drink",
        price: "2.95"
      },
      {
        title: "Sprite",
        content: "Lemon-lime flavored soda",
        price: "2.95"
      },
      {
        title: "Water",
        content: "Mineral water",
        price: "1.95"
      }
    ]
  }
];

module.exports = menuData; 