import React from 'react';
import {
    FiHome, FiUsers, FiBarChart2, FiShield, FiBriefcase, FiInbox,
    FiSettings, FiFileText, FiHexagon, FiDollarSign, FiAward, FiGitMerge,
    FiSun
} from 'react-icons/fi';

export interface MenuLink {
    path: string;
    label: string;
    icon: React.ElementType;
}

export interface MenuCategory {
    title: string;
    icon: React.ElementType;
    links: MenuLink[];
}

export type MenuConfig = MenuCategory[];

export const menuConfig: MenuConfig = [
    {
        title: 'Club',
        icon: FiHome,
        links: [
            { path: '/dashboard', label: 'Dashboard', icon: FiHome },
            { path: '/squad', label: 'Squad', icon: FiUsers },
            { path: '/tactics', label: 'Tactics', icon: FiSettings },
            { path: '/training', label: 'Training', icon: FiBarChart2 },
            { path: '/youth-academy', label: 'Youth Academy', icon: FiSun },
        ],
    },
    {
        title: 'Office',
        icon: FiBriefcase,
        links: [
            { path: '/inbox', label: 'Inbox', icon: FiInbox },
            { path: '/transfers', label: 'Transfers', icon: FiGitMerge },
            { path: '/staff', label: 'Staff', icon: FiUsers },
            { path: '/finances', label: 'Finances', icon: FiDollarSign },
            { path: '/sponsors', label: 'Sponsors', icon: FiAward },
        ],
    },
    {
        title: 'Competition',
        icon: FiShield,
        links: [
            { path: '/league', label: 'League Table', icon: FiBarChart2 },
            { path: '/fixtures', label: 'Fixtures & Results', icon: FiFileText },
        ],
    },
    {
        title: 'World',
        icon: FiHexagon,
        links: [
            { path: '/clubs', label: 'Club Directory', icon: FiShield },
            { path: '/guilds', label: 'Guilds & Factions', icon: FiHexagon },
            { path: '/history', label: 'Club History', icon: FiAward },
            { path: '/legal', label: 'Legal', icon: FiFileText },
        ],
    },
];
