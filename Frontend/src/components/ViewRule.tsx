import React, { useState, useEffect } from 'react';
import { getRule, getAllRuleNames } from '../api/rulesApi';
import ASTTreeVisualizer from './ASTTreeVisualizer';

interface ASTNode {
    type: 'operator' | 'operand';
    operator?: 'AND' | 'OR';
    left: ASTNode | null;
    right: ASTNode | null;
    value: {
        attribute: string;
        operator: string;
        comparisonValue: string;
    } | null;
}

const ViewRule: React.FC = () => {
    const [allRuleNames, setAllRuleNames] = useState<string[]>([]);
    const [selectedRule, setSelectedRule] = useState('');
    const [rule, setRule] = useState<{ ruleName: string; ast: ASTNode } | null>(null);

    useEffect(() => {
        fetchRuleNames();
    }, []);

    const fetchRuleNames = async () => {
        try {
            const response = await getAllRuleNames();
            setAllRuleNames(response.data.ruleNames);
        } catch (error) {
            console.error('Error fetching rule names', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await getRule(selectedRule);
            setRule(response.data);
        } catch (error) {
            console.error('Error fetching rule', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">View Rule</h2>
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
                <button type="submit" className="w-full bg-blue-600 py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white font-semibold transition-colors duration-200">
                    View Rule
                </button>
            </form>
            {rule && (
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold text-gray-100 mb-4">{rule.ruleName}</h3>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <ASTTreeVisualizer data={rule.ast} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewRule;
