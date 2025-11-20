import React from 'react';
import MainCard from '../../ui/MainCard';

const Suggestion = () => {
    const suggestions = [
        <>
            Shift <span className="font-bold text-white">₹8,000</span> from IGCSE Science – Borivali to IGCSE Combo – Goregaon for potential{' '}
            <span className="font-bold text-white">+14-18 extra leads</span> this week.
        </>,
        <>
            Pause underperforming <span className="font-bold text-white">ICSE 9th campaign on Meta (CPL {'>'} ₹650)</span> and move to Google Search.
        </>,
        <>
            Increase daily budget of <span className="font-bold text-white">IBDP Math campaign </span>by 20% during evenings (7–10 pm){' '}
            where CTR is <span className="font-bold text-white">2.3x </span>higher.
        </>
    ];

    return (
        <MainCard>
                <h2 className="text-xl font-semibold text-[#FDE68A] mb-4" >AI Budget & Performance Suggestions</h2>
                <ul className="list-disc list-inside space-y-3 text-sm text-gray-300">
                    {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                </ul>
        </MainCard>
    );
};

export default Suggestion;
