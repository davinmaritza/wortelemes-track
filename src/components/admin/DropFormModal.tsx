'use client';

import React, { useState, useEffect } from 'react';
import { UpcomingDropItem } from '@/types/diecast';
import { X, Calendar, Edit3, PlusCircle } from 'lucide-react';

interface DropFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  dropToEdit?: UpcomingDropItem | null;
  onSave: (drop: UpcomingDropItem) => void;
}

export const DropFormModal: React.FC<DropFormModalProps> = ({
  isOpen,
  onClose,
  dropToEdit,
  onSave,
}) => {
  const isEditing = Boolean(dropToEdit);

  const [model, setModel] = useState('');
  const [series, setSeries] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('NOV 2026');
  const [status, setStatus] = useState('Upcoming');

  useEffect(() => {
    if (dropToEdit) {
      setModel(dropToEdit.model);
      setSeries(dropToEdit.series);
      setDate(dropToEdit.date);
      setMonth(dropToEdit.month);
      setStatus(dropToEdit.status);
    } else {
      setModel('');
      setSeries('Red Line Club');
      setDate('Nov 20');
      setMonth('NOV 2026');
      setStatus('Upcoming');
    }
  }, [dropToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim() || !series.trim()) return;

    const savedData: UpcomingDropItem = {
      id: dropToEdit?.id || `drop-${Date.now()}`,
      model: model.trim(),
      series: series.trim(),
      date: date.trim() || 'TBA',
      month: month.trim() || '2026',
      status: status.trim() || 'Upcoming',
    };

    onSave(savedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#16181f] border border-[#242735] w-full max-w-sm rounded-2xl p-5 flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#242735]">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Edit3 className="w-5 h-5 text-amber-400" />
            ) : (
              <PlusCircle className="w-5 h-5 text-[#0066d6]" />
            )}
            <h2 className="text-white font-black text-sm uppercase tracking-wide">
              {isEditing ? 'Edit Drop Event' : 'Add Drop Event'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#242735] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">
              Vehicle Model / Release Name *
            </label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. 1993 McLaren F1 (RLC Exclusive)"
              className="w-full bg-[#111217] border border-[#242735] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0066d6]"
              autoFocus
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">
              Series / Line *
            </label>
            <input
              type="text"
              required
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              placeholder="e.g. Red Line Club, Silver Series"
              className="w-full bg-[#111217] border border-[#242735] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0066d6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">
                Drop Date Label
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Nov 18"
                className="w-full bg-[#111217] border border-[#242735] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">
                Month Tag
              </label>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="e.g. NOV 2026"
                className="w-full bg-[#111217] border border-[#242735] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">
              Drop Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#111217] border border-[#242735] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#0066d6]"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Live">Live / Active</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#1a1d26] hover:bg-[#242735] text-gray-300 font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#0066d6] hover:bg-blue-600 active:scale-95 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow"
            >
              {isEditing ? 'Save Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
