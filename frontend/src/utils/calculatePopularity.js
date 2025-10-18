export const calculatePopularity = (user) => {
  return (user.hobbies?.length || 0) * user.age;
};
