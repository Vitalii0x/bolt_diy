import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogDescription, DialogButton } from "@/components/ui/Dialog";
import * as RadixDialog from "@radix-ui/react-dialog";
import Bowser from "bowser";
import { BrowserIconsAnimated } from '../ui/BrowserIconsAnimated';

const BrowserUnsupportedPopup = () => {
    const [isUnsupported, setIsUnsupported] = useState<boolean>(false);

    useEffect(() => {
    const featuresSupported =
      "fetch" in window &&
      "Promise" in window &&
      "IntersectionObserver" in window &&
      "localStorage" in window;

    const browser = Bowser.getParser(window.navigator.userAgent);
    const browserName = browser.getBrowserName();
    const browserVersion = browser.getBrowserVersion();

    let oldSafari = false;
    if (browserName === "Safari") {
      const majorVersion = parseInt(browserVersion.split(".")[0], 10);
      if (majorVersion < 13) { 
        // You can adjust the version threshold
        oldSafari = true;
      }
    }

    if (!featuresSupported || oldSafari) {
      setIsUnsupported(true);
    }


  }, []);
    if(!isUnsupported){
        return null;
    }
    const handleClose = () => {
    setIsUnsupported(false);
  };
    
  return (
    <RadixDialog.Root open={isUnsupported}>
      <Dialog showCloseButton={false}>
        <div className="p-6 text-center">
          <DialogTitle className='w-[95%] mx-auto'>askblake website isn’t fully supported here.</DialogTitle>
          {/* <div className="flex justify-center gap-6 my-8">
            <img src={BraveImg} alt="brave" width={50} height={50} />
            <img src={ChromeImg} alt="chrome" width={50} height={50} />
            <img src={OperaImg} alt="opera" width={66} height={66} />
            <img src={FireFoxImg} alt="firefox" width={50} height={50} />
            <img src={EdgeImg} alt="edge" width={50} height={50} />
          </div> */}
          <BrowserIconsAnimated />
          <DialogDescription>
            Does the UI look a little off? Your browser's kinda old-school for what we've built.
            {/* <br /> */}
             Switch to Chrome, Firefox, Edge, Brave, or another Chromium-powered browser and see the magic happen.
          </DialogDescription>
          <div className="mt-6">
            <DialogButton type="primary" onClick={handleClose}>
              Continue (You’ve been advised!)
            </DialogButton>
          </div>
        </div>
      </Dialog>
    </RadixDialog.Root>
  )
}

export default BrowserUnsupportedPopup