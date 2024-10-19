import React, { useState } from 'react';
import { createRule } from '../api/rulesApi';
import axios from 'axios';

const CreateRule: React.FC = () => {
    const [ruleName, setRuleName] = useState('');
    const [ruleString, setRuleString] = useState('');
    const [response, setResponse] = useState<{ message?: string; error?: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponse(null);
        try {
            const result = await createRule({ ruleName, ruleString });
            setResponse({ message: result.data.message });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                switch (statusCode) {
                    case 400:
                        setResponse({ error: 'Invalid input. Please check your rule name and rule string.' });
                        break;
                    case 409:
                        setResponse({ error: 'Rule name already exists. Please choose a different name.' });
                        break;
                    default:
                        setResponse({ error: 'Failed to create rule. Please try again.' });
                }
            } else {
                setResponse({ error: 'An unexpected error occurred. Please try again.' });
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Create Rule</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="ruleName" className="block text-sm font-medium text-gray-300 mb-2">Rule Name</label>
                    <input
                        id="ruleName"
                        type="text"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        placeholder="Enter rule name"
                        required
                        className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="ruleString" className="block text-sm font-medium text-gray-300 mb-2">Rule String</label>
                    <textarea
                        id="ruleString"
                        value={ruleString}
                        onChange={(e) => setRuleString(e.target.value)}
                        placeholder="((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)"
                        required
                        className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        rows={6}
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white font-semibold transition-colors duration-200">
                    Create Rule
                </button>
            </form>
            {response && (
                <div className={`mt-6 p-4 rounded-md ${response.message ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                    <p className="font-medium">{response.message || response.error}</p>
                </div>
            )}
        </div>
    );
};

export default CreateRule;
