import React from 'react';
import { Download, FileText, Share2 } from 'lucide-react';

const GenerateProposal: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Generate Proposal</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compile your pitch into a professional funding proposal ready for investors
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">PDF Export</h3>
            <p className="text-gray-400 mb-4">Generate a professional PDF proposal</p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              Generate PDF
            </button>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Share2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Share Link</h3>
            <p className="text-gray-400 mb-4">Create a shareable link for investors</p>
            <button className="bg-white/10 border border-white/20 text-white font-medium py-2 px-4 rounded-lg hover:bg-white/20 transition-all">
              Create Link
            </button>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Download className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Data Export</h3>
            <p className="text-gray-400 mb-4">Export your data and analytics</p>
            <button className="bg-white/10 border border-white/20 text-white font-medium py-2 px-4 rounded-lg hover:bg-white/20 transition-all">
              Export Data
            </button>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Proposal Preview</h2>
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <p className="text-gray-400 mb-4">
              Your proposal will include all the information you've provided:
            </p>
            <ul className="space-y-2 text-gray-400">
              <li>• Executive Summary</li>
              <li>• Business Model & Market Analysis</li>
              <li>• Financial Projections</li>
              <li>• Team Structure & Equity</li>
              <li>• Funding Requirements</li>
              <li>• Risk Assessment</li>
            </ul>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 mb-6">
              Complete your pitch information to generate a comprehensive proposal
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
              Complete Pitch First
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateProposal;
