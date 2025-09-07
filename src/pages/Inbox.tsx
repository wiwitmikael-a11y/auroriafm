import React, { useState } from 'react';
import { useWorld } from '../contexts/WorldContext';
import { InboxMessage } from '../types';

const Inbox: React.FC = () => {
    const { inboxMessages, markMessageAsRead, handleGuildAction } = useWorld();
    const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(inboxMessages.find(m => !m.isRead) || inboxMessages[0] || null);

    const handleSelectMessage = (message: InboxMessage) => {
        setSelectedMessage(message);
        if (!message.isRead) {
            markMessageAsRead(message.id);
        }
    };

    return (
        <div className="flex h-full gap-4">
            <div className="w-1/3 flex flex-col">
                <div className="mb-4 flex-shrink-0">
                    <h1 className="text-3xl font-display font-black text-text-emphasis uppercase tracking-widest" style={{textShadow: '0 0 10px var(--color-accent)'}}>Inbox</h1>
                    <p className="text-md text-text-secondary">Your personal correspondence.</p>
                </div>
                <div className="flex-grow overflow-y-auto space-y-2 glass-surface p-2">
                    {inboxMessages.map(msg => (
                        <div
                            key={msg.id}
                            onClick={() => handleSelectMessage(msg)}
                            className={`relative p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                                selectedMessage?.id === msg.id ? 'bg-cyan-500/20' : !msg.isRead ? 'bg-slate-700/40 hover:bg-slate-700/70' : 'hover:bg-slate-700/50'
                            }`}
                        >
                            <p className={`truncate text-text-primary ${!msg.isRead ? 'font-bold' : ''}`}>{msg.subject}</p>
                            <p className="text-sm text-text-secondary">{msg.sender}</p>
                            <p className="text-xs text-text-secondary">{msg.date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-2/3 h-full glass-surface p-6 flex flex-col">
                {selectedMessage ? (
                    <>
                        <h2 className="text-2xl font-bold text-text-emphasis mb-1">{selectedMessage.subject}</h2>
                        <p className="text-sm text-text-secondary mb-4 border-b border-border pb-3">From: {selectedMessage.sender} | {selectedMessage.date}</p>
                        <div className="flex-grow overflow-y-auto whitespace-pre-wrap text-text-primary pr-2">
                            {selectedMessage.body}
                        </div>
                        {selectedMessage.actions && selectedMessage.guildId && (
                            <div className="mt-4 pt-4 border-t-2 border-border flex gap-4">
                                {selectedMessage.actions.map((action, index) => (
                                    <button 
                                      key={index} 
                                      className="button-primary"
                                      onClick={() => handleGuildAction(selectedMessage.guildId!, action)}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-text-secondary">Select a message to read.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;