import { useEffect, useState } from "react";
import { Input } from "../ui"
import { useIframeRef } from "~/lib/context/IframeContext";



export const DesignMode = () => {
    const iframeRef = useIframeRef();
    const [primaryHex, setPrimaryHex] = useState('#ff0000');


    // ✅ Helper: Convert Hex to HSL
    function hexToHSL(hex: string) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex.split('').map((x) => x + x).join('');
        }
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;

        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h = 0,
            s = 0,
            l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h *= 60;
        }

        return {
            h: Math.round(h),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        };
    }


    useEffect(() => {
        // after any state change, e.g., primaryHex updated
        if (!iframeRef.current) return;

        const hsl = hexToHSL(primaryHex);
        if (!hsl) return;

        const hslString = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
        const colorVar = "--primary";

        // send the message
        iframeRef.current.contentWindow?.postMessage(
            {
                type: "SET_THEME_COLOR",
                key: colorVar,
                value: hslString
            },
            "*"
        );

        // sanity test: also set it locally in this app
        document.documentElement.style.setProperty(colorVar, hslString);
    }, [primaryHex]);

    return (
        <div className="mt-2.5 p-2 text-white">
            <p className="back">Colors</p>
            <div className="border border-gray-700 rounded-md p-3 mt-4">
                <div>
                    <h4 className="text-[16px]">Primary Colors</h4>
                </div>
                <div className="flex items-center mt-4 gap-2">
                    <div
                        className="w-10 h-9 rounded-md border border-white"
                        style={{ backgroundColor: primaryHex }}
                    />
                    <Input
                        type="color"
                        value={primaryHex}
                        onChange={(e) => setPrimaryHex(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}