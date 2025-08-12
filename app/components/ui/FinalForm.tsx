import { AnimatePresence, motion } from "framer-motion"
import { LoginForm } from "./login-form"
import { useSignIn } from '~/lib/context/SignInContext';

const FinalForm = () => {

    const { isOpen, modalRef, handleClickOutside } = useSignIn();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="overlay"
                    onClick={handleClickOutside}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#858382b3] dark:bg-[#1b1d20e6] items-center flex-col justify-center w-full h-screen absolute left-0 top-0 z-[999] flex"
                >
                    <motion.h3
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-black dark:text-white text-3xl font-light mb-3"
                    >
                        askblake.
                    </motion.h3>

                    <motion.div
                        key="modal"
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="w-[444px] bg-[#E7E2E0] dark:bg-[#252a30] p-4 rounded-lg border border-[#c2bdbb] dark:border-[#4b525b]"
                    >
                        <LoginForm />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default FinalForm