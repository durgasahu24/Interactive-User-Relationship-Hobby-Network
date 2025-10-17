import User from "../models/user.model.js";


export const calculatePopularity = async (user) => {
  try {
    // Find all friends whose _id is in user's friends list
    const friendDocs = await User.find({ _id: { $in: user.friends } });

    let sharedHobbies = 0;

    // Calculate total shared hobbies
    friendDocs.forEach((friend) => {
      const shared = friend.hobbies.filter((hobby) =>
        user.hobbies.includes(hobby)
      ).length;
      sharedHobbies += shared;
    });

    // Popularity formula
    const score = user.friends.length + sharedHobbies * 0.5;

    return score;
  } catch (error) {
    console.error("Error calculating popularity:", error);
    return 0; 
  }
};
