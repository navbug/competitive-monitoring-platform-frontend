const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;