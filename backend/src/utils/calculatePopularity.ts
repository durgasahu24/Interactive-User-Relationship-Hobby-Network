import User , {IUser} from "../models/user.model";


export const calculatePopularity = async (user: IUser): Promise<number> => {
    
  const friendDocs = await User.find({ _id: { $in: user.friends } });
  let sharedHobbies = 0;

  friendDocs.forEach(friend => {
    const shared = friend.hobbies.filter(h => user.hobbies.includes(h)).length;
    sharedHobbies += shared;
  });

  return user.friends.length + sharedHobbies * 0.5;

};
