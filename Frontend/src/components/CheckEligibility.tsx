import React, { useState, useEffect } from 'react';
import { evaluateRule, getAllRuleNames } from '../api/rulesApi';

const CheckEligibility: React.FC = () => {
    const [allRuleNames, setAllRuleNames] = useState<string[]>([]);
    const [selectedRule, setSelectedRule] = useState('');
    const [keyValuePairs, setKeyValuePairs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
    const [result, setResult] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRuleNames();
    }, []);

    const fetchRuleNames = async () => {
        try {
            const response = await getAllRuleNames();
            setAllRuleNames(response.data.ruleNames);
        } catch (error) {
            console.error('Error fetching rule names', error);
            setError('Failed to fetch rule names. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResult(null);
        setError(null);
        try {
            const data = Object.fromEntries(
                keyValuePairs
                    .filter(pair => pair.key.trim() !== '')
                    .map(pair => [pair.key.trim(), pair.value.trim()])
            );
            const response = await evaluateRule({
                ruleName: selectedRule,
                data: data
            });
            setResult(response.data.result);
        } catch {
            setError('Failed to evaluate rule. Please try again.');
        }
    };

    const handleKeyValueChange = (index: number, field: 'key' | 'value', value: string) => {
        const newPairs = [...keyValuePairs];
        newPairs[index][field] = value;
        setKeyValuePairs(newPairs);
    };

    const addKeyValuePair = () => {
        setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
    };

    const removeKeyValuePair = (index: number) => {
        const newPairs = keyValuePairs.filter((_, i) => i !== index);
        setKeyValuePairs(newPairs);
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Check Eligibility</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="rule" className="block text-sm font-medium text-gray-300 mb-2">Select Rule</label>
                    <select
                        id="rule"
                        value={selectedRule}
                        onChange={(e) => setSelectedRule(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <option value="">Select a rule</option>
                        {allRuleNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Data (Key-Value Pairs)</label>
                    {keyValuePairs.map((pair, index) => (
                        <div key={index} className="flex space-x-2 mb-3">
                            <input
                                type="text"
                                value={pair.key}
                                onChange={(e) => handleKeyValueChange(index, 'key', e.target.value)}
                                placeholder="Key"
                                className="flex-1 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                            <input
                                type="text"
                                value={pair.value}
                                onChange={(e) => handleKeyValueChange(index, 'value', e.target.value)}
                                placeholder="Value"
                                className="flex-1 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeKeyValuePair(index)}
                                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addKeyValuePair}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Add Key-Value Pair
                    </button>
                </div>
                <button type="submit" className="w-full bg-blue-600 py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white font-semibold transition-colors duration-200">
                    Check Eligibility
                </button>
            </form>
            {result !== null && (
                <div className={`mt-6 p-4 rounded-md ${result ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                    <p className="font-medium">Result: {result ? 'Eligible' : 'Not Eligible'}</p>
                </div>
            )}
            {error && (
                <div className="mt-6 p-4 rounded-md bg-red-800 text-red-100">
                    <p className="font-medium">Error: {error}</p>
                </div>
            )}
        </div>
    );
};

export default CheckEligibility;
