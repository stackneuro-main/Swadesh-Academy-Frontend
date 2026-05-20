import { useState } from "react";
export default function Contact() {
   const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div>
        <div className="flex items-center justify-center">
      {!isLoaded && (
        <div className="absolute flex items-center justify-center bg-white">
          <p className="text-gray-500 animate-pulse">Loading...</p>
        </div>
      )}
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSermuk6FBu6uMB5Utf5LBjLsdB7BtieTsNHItSlzjYyOUyhgg/viewform?usp=header"
        title="Google Form"
        className="w-screen h-[90vh] border-0"
        onLoad={() => setIsLoaded(true)
        }
    >Loading…
      </iframe>
    </div>
      
      
    </div>
  )
}
