const Room = () => {
  return (
    <>
      <div className="relative h-screen">
      <img
        className="fixed inset-0 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1690192436145-6f9942af5156?w=600&auto=format&fit=crop"
        alt="background"
      />

      <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-xs">
        <div className="flex items-center justify-center h-full">
          <div className="z-20 p-7 rounded-lg w-110 h-100 shadow-xl flex items-center justify-center gap-8 bg-[url('https://images.unsplash.com/photo-1759060473432-2cfa48d8ccee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbGxhYm9yYXRpdmUlMjB3aGl0ZWJvYXJkfGVufDB8fDB8fHww')]">
            <form className="space-y-6 w-72">
              <input
                id="name"
                type="text"
                required
                className="block w-full px-4 py-3 text-lg bg-white border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Your Name"
              />

              <input
                id="room_code"
                type="text"
                required
                className="block w-full px-4 py-3 text-lg bg-white border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Room Code"
                maxLength={8}
              />
                <div className="flex">
                <button className="flex-1 py-3 text-lg  bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md">
                  Join Room
                </button>
                </div>
                <div className="text-white font-serif">
                  Don't have any code? <a href="*" className="text-blue-200">Generate Code</a>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Room
