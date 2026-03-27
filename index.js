const express = require("express");
const bodyParser = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// store user sessions
let sessions = {};

app.post("/whatsapp", (req, res) => {

const twiml = new MessagingResponse();
const msg = req.body.Body ? req.body.Body.trim().toLowerCase() : "";
const user = req.body.From;

// create session if new user
if(!sessions[user]){
    sessions[user] = { step: "menu", product: null };
}

const step = sessions[user].step;

// MAIN MENU
if(msg === "hi" || msg === "0"){

sessions[user].step = "menu";

twiml.message(
`Hello! Welcome to LaMilage Cosmetics

1. View Products
2. Available Stores
3. Contact Agency`
);

}

// VIEW PRODUCTS
else if(msg === "1" && step === "menu"){

sessions[user].step = "category";

twiml.message(
`Select a category:

1. Fragrances
2. Skin Care

0. Main Menu`
);

}

// STORES
else if(msg === "2" && step === "menu"){

twiml.message(
`Our store branches:

1. Riverside - Next to Checkers
2. White River - Opposite Mikon
3. Ngodini - Next to Shoprite

0. Main Menu`
);

}

// CONTACT
else if(msg === "3" && step === "menu"){

twiml.message(
`Contact our agency:

Riverside: 082 439 8434
White River: 082 439 8434
Ngodini: 082 439 8434

0. Main Menu`
);

}

// FRAGRANCE CATEGORY
else if(msg === "1" && step === "category"){

sessions[user].step = "fragrances";

twiml.message(
`Fragrances:

1. Black Oud - R250
2. White Oud - R230

0. Main Menu`
);

}

// SKIN CARE CATEGORY
else if(msg === "2" && step === "category"){

sessions[user].step = "skincare";

twiml.message(
`Skin Care Products:

1. Bathing Soap - R80
2. Face Cream - R120

0. Main Menu`
);

}

// SELECT PRODUCTS
else if(msg === "1" && step === "fragrances"){

sessions[user].step = "confirm";
sessions[user].product = "Black Oud";

twiml.message(
`You selected Black Oud 🛒

Reply:
1. Confirm Order
0. Cancel`
);

}

else if(msg === "2" && step === "fragrances"){

sessions[user].step = "confirm";
sessions[user].product = "White Oud";

twiml.message(
`You selected White Oud 🛒

Reply:
1. Confirm Order
0. Cancel`
);

}

else if(msg === "1" && step === "skincare"){

sessions[user].step = "confirm";
sessions[user].product = "Bathing Soap";

twiml.message(
`You selected Bathing Soap 🛒

Reply:
1. Confirm Order
0. Cancel`
);

}

else if(msg === "2" && step === "skincare"){

sessions[user].step = "confirm";
sessions[user].product = "Face Cream";

twiml.message(
`You selected Face Cream 🛒

Reply:
1. Confirm Order
0. Cancel`
);

}

// CONFIRM ORDER
else if(msg === "1" && step === "confirm"){

twiml.message(
`✅ Order confirmed!

Product: ${sessions[user].product}

An agency will contact you shortly to complete your payment and verify your lolcation for delivery or collection.`
);

sessions[user] = { step: "menu", product: null };

}

else{

twiml.message("Invalid input. Reply 0 to return to the main menu.");

}

res.writeHead(200, {"Content-Type": "text/xml"});
res.end(twiml.toString());

});

app.listen(3000, () => {
console.log("WhatsApp bot running on port 3000");
});