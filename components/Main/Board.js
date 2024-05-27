


const Board = () => {
  return (
    <div className="w-full border-4 h-full p-4">
      <div className="h-20   flex p-4">header</div>

      <div className="flex border-4  justify-center ">
        <div className="pr-4 mt-4 mb-4 w-2/3 border-4"> action </div>

        <div className="pl-4  mt-4 mb-4 border-4 w-1/3"> summary </div>
      </div>
    </div>
  );
};

export default Board;