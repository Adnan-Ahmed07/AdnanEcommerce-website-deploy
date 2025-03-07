const UnAuthPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-900 to-blue-900">
      <div className="bg-black text-white p-8 rounded-2xl shadow-2xl text-center animate-bounce">
        <h1 className="text-5xl font-extrabold text-yellow-400">⚠ Unauthorized Access</h1>
        <p className="mt-4 text-lg text-gray-300">
          We are watching. Don't try to access this page!
        </p>
        <p className="mt-2 text-gray-400">
          - Warning by Website Owner, <span className="text-red-500 font-semibold">Adnan Ahmed</span>
        </p>
      </div>
    </div>
  );
};

export default UnAuthPage;
