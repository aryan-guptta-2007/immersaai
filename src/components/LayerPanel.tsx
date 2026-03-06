"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Layers, X } from "lucide-react";
import { BrandContext } from "./PreviewCanvas";

interface LayerPanelProps {
    context: BrandContext;
    onUpdate: (ctx: BrandContext) => void;
}

export function LayerPanel({ context, onUpdate }: LayerPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    // If we don't have structured pages yet, don't show the layer panel
    if (!context.pages || !context.pages[0] || !context.pages[0].sections) return null;

    const sections = context.pages[0].sections;

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(context.pages![0].sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const newContext = { ...context };
        if (newContext.pages && newContext.pages[0]) {
            const newPages = [...newContext.pages];
            newPages[0] = { ...newPages[0], sections: items };
            newContext.pages = newPages;
            onUpdate(newContext);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed top-24 left-6 z-50 w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-colors shadow-lg shadow-black/50"
                >
                    <Layers className="w-5 h-5" />
                </motion.button>
            )}

            {/* Slide-out Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-20 left-4 bottom-24 w-72 z-50 rounded-2xl glass-panel border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-primary" />
                                <span className="text-sm font-mono font-bold text-white uppercase tracking-widest">Layout Layers</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Draggable List */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="sections-list">
                                    {(provided: any) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                            {sections.map((section: any, index: number) => (
                                                <Draggable key={`${section.type}-${index}`} draggableId={`${section.type}-${index}`} index={index}>
                                                    {(provided: any, snapshot: any) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${snapshot.isDragging
                                                                    ? "bg-white/10 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] z-50"
                                                                    : "bg-black/40 border-white/5 hover:bg-white/5"
                                                                }`}
                                                        >
                                                            <div {...provided.dragHandleProps} className="text-white/30 hover:text-primary transition-colors p-1 cursor-grab active:cursor-grabbing">
                                                                <GripVertical className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-semibold text-white truncate capitalize">
                                                                    {section.type}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
