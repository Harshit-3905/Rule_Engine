import React, { useState, useEffect } from 'react';
import { combineRules, getAllRuleNames } from '../api/rulesApi';

const CombineRules: React.FC = () => {
    const [allRuleNames, setAllRuleNames] = useState<string[]>([]);
    const [selectedRules, setSelectedRules] = useState<string[]>(['']);
    const [operator, setOperator] = useState<'AND' | 'OR'>('AND');
    const [newRuleName, setNewRuleName] = useState('');
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
        setError(null);
        try {
            const filteredRules = selectedRules.filter(rule => rule !== '');
            if (filteredRules.length < 2) {
                setError('Please select at least two rules to combine.');
                return;
            }
            const response = await combineRules({
                ruleNames: filteredRules,
                operator,
                newRuleName
            });
            alert(`Rules combined successfully: ${response.data.newRule.ruleName}`);
            setSelectedRules(['']);
            setNewRuleName('');
        } catch (error) {
            console.error('Error combining rules', error);
            setError('Failed to combine rules. Please try again.');
        }
    };

    const handleRuleSelect = (index: number, value: string) => {
        const newSelectedRules = [...selectedRules];
        newSelectedRules[index] = value;
        setSelectedRules(newSelectedRules);
    };

    const addRuleDropdown = () => {
        if (selectedRules.length < allRuleNames.length) {
            setSelectedRules([...selectedRules, '']);
        }
    };

    const removeRuleDropdown = (index: number) => {
        const newSelectedRules = selectedRules.filter((_, i) => i !== index);
        setSelectedRules(newSelectedRules);
    };

    const getAvailableRules = (index: number) => {
        return allRuleNames.filter(rule => !selectedRules.includes(rule) || selectedRules[index] === rule);
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Combine Rules</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {selectedRules.map((rule, index) => (
                    <div key={index} className="flex space-x-2">
                        <select
                            value={rule}
                            onChange={(e) => handleRuleSelect(index, e.target.value)}
                            required
                            className="flex-grow px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            <option value="">Select a rule</option>
                            {getAvailableRules(index).map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeRuleDropdown(index)}
                                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                {selectedRules.length < allRuleNames.length && (
                    <button
                        type="button"
                        onClick={addRuleDropdown}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Add Rule
                    </button>
                )}
                <div>
                    <label htmlFor="operator" className="block text-sm font-medium text-gray-300 mb-2">Operator</label>
                    <select
                        id="operator"
                        value={operator}
                        onChange={(e) => setOperator(e.target.value as 'AND' | 'OR')}
                        required
                        className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="newRuleName" className="block text-sm font-medium text-gray-300 mb-2">New Rule Name</label>
                    <input
                        id="newRuleName"
                        type="text"
                        value={newRuleName}
                        onChange={(e) => setNewRuleName(e.target.value)}
                        placeholder="Enter new rule name"
                        required
                        className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white font-semibold transition-colors duration-200">
                    Combine Rules
                </button>
            </form>
            {error && (
                <div className="mt-6 p-4 rounded-md bg-red-800 text-red-100">
                    <p className="font-medium">{error}</p>
                </div>
            )}
        </div>
    );
};

export default CombineRules;
