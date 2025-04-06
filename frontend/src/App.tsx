import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./components/ui/button";


function App() {
  

  return (
    <>
      <h1 className="text-red-500 text-5xl">Hello</h1>
      <header>
      <SignedOut>
        <SignInButton> 
          <Button>
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    </>
  )
}

export default App
