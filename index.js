const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.models");

app.use(express.json());

initializeDatabase();

async function createHotel(newHotel) {
  try {
    const hotel = new Hotel(newHotel);
    const savedHotel = await hotel.save();
    return savedHotel;
  } catch (error) {
    throw error;
  }
}

app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);
    res
      .status(201)
      .json({ message: "Hotel added successfully.", hotel: savedHotel });
  } catch (error) {
    res.status(500).json({ error: "Failed to add hotel." });
  }
});

async function readAllHotels() {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      return res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

async function getHotelByName(hotelName) {
  try {
    const hotelByName = await Hotel.findOne({ name: hotelName });
    return hotelByName;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await getHotelByName(req.params.hotelName);
    if (hotel) {
      res.json(hotel);
    } else {
      return res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel." });
  }
});

async function getHotelByPhoneNumber(phoneNumber) {
  try {
    const hotelByPhoneNumber = await Hotel.findOne({
      phoneNumber: phoneNumber,
    });
    return hotelByPhoneNumber;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await getHotelByPhoneNumber(req.params.phoneNumber);
    if (hotel) {
      res.json(hotel);
    } else {
      return res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel." });
  }
});

async function readHotelsByRating(hotelRating) {
  try {
    const hotelsByRating = await Hotel.find({ rating: hotelRating });
    return hotelsByRating;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await readHotelsByRating(req.params.hotelRating);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      return res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

async function readHotelsByCategory(hotelCategory) {
  try {
    const hotelsByCategory = await Hotel.find({ category: hotelCategory });
    return hotelsByCategory;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await readHotelsByCategory(req.params.hotelCategory);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      return res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

async function updateHotel(hotelId, dataToUpdate) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {
      new: true,
    });

    return updatedHotel;
  } catch (error) {
    console.log("Error in updating hotel rating", error);
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotel(req.params.hotelId, req.body);

    if (updatedHotel) {
      res.status(200).json({
        message: "Hotel updated successfully.",
        updatedHotel: updatedHotel,
      });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Hotel." });
  }
});

async function deleteHotel(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    return deletedHotel;
  } catch (error) {
    throw error;
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId);

    if (deletedHotel) {
      res.status(201).json({ message: "Hotel deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
