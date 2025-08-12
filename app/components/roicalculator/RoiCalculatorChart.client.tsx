import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { CustomSlider } from '~/components/ui/CustomSlider';
import closeIcon from '../../../icons/close-large-fill.svg'
import { Tooltip as SparkTooltip } from '~/components/ui/Tooltip';
import { AnimatePresence, motion } from 'framer-motion';

const HOURS_PER_DAY = 8;
const BUSINESS_DAYS_PER_WEEK = 5;
const DAYS_PER_WEEK = 7;
const TEMPLATE_COST = 49;

interface ROIProps {
    setIsROIOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isROIOpen: boolean
}

export default function RoiCalculatorChart({ setIsROIOpen, isROIOpen }: ROIProps) {
    const [designerDays, setDesignerDays] = useState(16);
    const [developerDays, setDeveloperDays] = useState(13.5);
    const [designerRate, setDesignerRate] = useState(100);
    const [developerRate, setDeveloperRate] = useState(150);

    const { totalCost, businessDays, totalWeeks, savings, percentageSaved, daysFaster, weeksFaster } = useMemo(() => {
        const designerCost = designerDays * HOURS_PER_DAY * designerRate;
        const developerCost = developerDays * HOURS_PER_DAY * developerRate;
        const totalCost = designerCost + developerCost;
        const businessDays = designerDays + developerDays;
        const totalWeeks = businessDays / BUSINESS_DAYS_PER_WEEK;
        const savings = totalCost - TEMPLATE_COST;
        const percentageSaved = (savings / totalCost) * 100;
        const daysFaster = businessDays;
        const weeksFaster = daysFaster / BUSINESS_DAYS_PER_WEEK;
        return { totalCost, businessDays, totalWeeks, savings, percentageSaved, daysFaster, weeksFaster };
    }, [designerDays, developerDays, designerRate, developerRate]);

    return (
        <AnimatePresence>
            {isROIOpen && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-full h-full bg-[#858382b3] dark:bg-[#1d2125f5] fixed z-999 top-0 left-0 flex flex-col items-center justify-center`}>
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className='bg-[#E7E2E0] p-4 dark:p-0 rounded-lg dark:rounded-none dark:bg-[#1D2125]'>

                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className='mb-5'>
                            <div className='relative min-w-5xl'>
                                <h3 className="dark:text-white text-[32px]" >
                                    Savings Calculator
                                </h3>
                                <SparkTooltip side="top" content="Close">
                                    <img src={closeIcon} alt="closeIcon" className='absolute right-9 top-3.5 cursor-pointer transition-colors duration-[250ms] rounded-md hover:bg-[#4B525B] px-2 py-1.5 invert-100 dark:invert-0' onClick={() => setIsROIOpen(false)} />
                                </SparkTooltip>
                            </div>
                            <div className='w-[952px] mx-auto h-[1px] bg-[#C9C5C3] dark:bg-[#4B525B] mt-2.5' />
                            <h4 className='dark:text-[#FDFCFD] mt-5 text-[16px] leading-[28px]'>See how much time and money you'll save by relying on our context <br /> engineering instead of starting from scratch.</h4>
                        </motion.div>
                        <div className="z-10 p-1 max-w-[952px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 rounded-lg items-center">


                            <Card className='bg-[#D8CDC9] border-[#C9C5C3] dark:bg-[#252A30] p-5 border-1 dark:border-[#4B525B] max-w-[420px]'>
                                <div className="space-y-6" >
                                    <div>
                                        <label className="block font-medium text-left pb-2.5 text-[14px]">Designer Time</label>
                                        <CustomSlider
                                            min={0}
                                            max={30}
                                            step={0.5}
                                            value={designerDays}
                                            onChange={(val) => setDesignerDays(val)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-left pb-2.5 text-[14px]">Developer Time </label>
                                        <CustomSlider
                                            min={0}
                                            max={30}
                                            step={0.5}
                                            value={developerDays}
                                            onChange={(val) => setDeveloperDays(val)}
                                        />
                                    </div>

                                    <div className="flex gap-4 max-w-[350px] mx-auto">
                                        <div className="flex-1">
                                            <label className="block text-[14px]">Developer Rate ($/Hour)</label>
                                            <Input type="number" className='mt-[4px] border-white bg-[white] dark:border-[#292E35] !px-2' value={designerRate} onChange={(e) => setDesignerRate(Number(e.target.value))} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[14px]">Designer Rate  ($/Hour)</label>
                                            <Input type="number" className='mt-[4px] border-white bg-[white] dark:border-[#292E35] !px-2' value={developerRate} onChange={(e) => setDeveloperRate(Number(e.target.value))} />
                                        </div>
                                    </div>

                                    <div className="text-sm text-left w-full">
                                        <p className='flex gap-2 text-[12px]'>Total estimated time: <p className='text-[#e7a962] dark:text-teal-400'>{totalWeeks.toFixed(1)} weeks ({businessDays.toFixed(1)} business days) </p></p>
                                        <p className='flex gap-2 pt-2.5 text-[12px]'>Total estimated cost: <p className='text-[#e7a962] dark:text-teal-400'>${totalCost.toLocaleString()}</p></p>
                                    </div>
                                </div>
                            </Card>

                            <Card className='border-none !shadow-none max-w-[500px]'>
                                <div className="space-y-5 ">

                                    <h4 className='text-[16px]'>Reduce costs by <span className='text-[#e7a962] dark:text-teal-400'>${savings.toLocaleString()}</span>.</h4>
                                    <h4 className='text-[16px]'>Making it <span className='text-[#e7a962] dark:text-teal-400'>{percentageSaved.toFixed(1)}%</span>  cheaper building with ask blake</h4>
                                    <h4 className='text-[16px]'>Launch <span className='text-[#e7a962] dark:text-teal-400'>{daysFaster.toFixed(1)} business days sooner</span> on average.</h4>
                                    <h4 className='text-[16px]'>That is <span className='text-[#e7a962] dark:text-teal-400'>almost {weeksFaster.toFixed(1)} weeks earlier</span>!</h4>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </motion.div>
            )}

        </AnimatePresence>
    );
}