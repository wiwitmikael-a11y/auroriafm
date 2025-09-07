import React from 'react';
import { useWorld } from '../contexts/WorldContext';

const Finances: React.FC = () => {
    const { findClubById, managerClubId } = useWorld();
    const club = findClubById(managerClubId);

    if (!club) return null;
    
    // Mock data for more detail
    const income = {
        gate_receipts: 250000,
        sponsorship: 150000,
        merchandise: 75000,
        prize_money: 50000,
    };
    const expenditure = {
        player_wages: 450000,
        staff_wages: 80000,
        stadium_maintenance: 40000,
        travel_costs: 25000,
    };
    const totalIncome = Object.values(income).reduce((a, b) => a + b, 0);
    const totalExpenditure = Object.values(expenditure).reduce((a, b) => a + b, 0);
    const netProfit = totalIncome - totalExpenditure;

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Finances</h1>
                <p className="text-md text-text-secondary">An overview of the club's financial health.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-surface p-6">
                    <h2 className="text-xl font-display font-bold text-accent mb-4">Budget Overview</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-text-secondary">Overall Balance</p>
                            <p className="text-3xl font-bold text-green-400">$10,450,000</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Transfer Budget Remaining</p>
                            <p className="text-3xl font-bold text-text-emphasis">${club.transfer_budget.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Wage Budget Remaining</p>
                            <p className="text-3xl font-bold text-text-emphasis">${club.wage_budget.toLocaleString()}</p>
                        </div>
                         <div>
                            <p className="text-sm text-text-secondary">Financial Status</p>
                            <p className="text-xl font-bold text-text-emphasis">{club.finances}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-surface p-6">
                    <h2 className="text-xl font-display font-bold text-accent mb-4">Monthly Financial Summary</h2>
                     <div className="space-y-4">
                        <div>
                            <p className="text-sm text-text-secondary">Total Income</p>
                            <p className="text-2xl font-bold text-green-400">${totalIncome.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Total Expenditure</p>
                            <p className="text-2xl font-bold text-red-400">${totalExpenditure.toLocaleString()}</p>
                        </div>
                        <div className="border-t border-border pt-3">
                            <p className="text-sm text-text-secondary">Net Profit/Loss</p>
                            <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>${netProfit.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finances;