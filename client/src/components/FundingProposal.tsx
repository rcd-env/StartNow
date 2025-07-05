import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Share2, Eye, Check, Copy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';
// @ts-expect-error - dom-to-image types not available
import domtoimage from 'dom-to-image';

interface FormData {
  companyName: string;
  industry: string;
  customIndustry: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  fundingAmount: string;
  useOfFunds: string;
  teamStructure: string;
  financialProjections: string;
  marketSegmentation: string;
}

interface FundingProposalProps {
  formData: FormData;
  onBack?: () => void;
}

const FundingProposal: React.FC<FundingProposalProps> = ({ formData, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const proposalRef = useRef<HTMLDivElement>(null);

  // Debug function to test html2canvas
  const testHtml2Canvas = async () => {
    console.log('Testing html2canvas...');

    // Create a simple test element
    const testDiv = document.createElement('div');
    testDiv.style.width = '200px';
    testDiv.style.height = '100px';
    testDiv.style.backgroundColor = 'red';
    testDiv.style.color = 'white';
    testDiv.style.padding = '20px';
    testDiv.innerHTML = 'Test Content';
    testDiv.style.position = 'fixed';
    testDiv.style.top = '10px';
    testDiv.style.left = '10px';
    testDiv.style.zIndex = '9999';

    document.body.appendChild(testDiv);

    try {
      const canvas = await html2canvas(testDiv);
      console.log('Test successful! Canvas:', canvas);

      // Create a simple PDF
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 50, 25);
      pdf.save('test.pdf');

      alert('Test PDF generated successfully!');
    } catch (error) {
      console.error('Test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Test failed: ' + errorMessage);
    } finally {
      document.body.removeChild(testDiv);
    }
  };

  // Sample data for visualizations
  const financialData = [
    { year: 'Year 1', revenue: 100000, expenses: 80000, profit: 20000 },
    { year: 'Year 2', revenue: 250000, expenses: 180000, profit: 70000 },
    { year: 'Year 3', revenue: 500000, expenses: 320000, profit: 180000 },
    { year: 'Year 4', revenue: 1000000, expenses: 600000, profit: 400000 },
    { year: 'Year 5', revenue: 2000000, expenses: 1200000, profit: 800000 },
  ];

  const marketSegmentData = [
    { name: 'Primary Market', value: 45, color: '#ffee99' },
    { name: 'Secondary Market', value: 30, color: '#4B5563' },
    { name: 'Emerging Market', value: 25, color: '#6B7280' },
  ];

  const fundingBreakdown = [
    { category: 'Product Development', amount: 40, color: '#ffee99' },
    { category: 'Marketing & Sales', amount: 25, color: '#4B5563' },
    { category: 'Operations', amount: 20, color: '#6B7280' },
    { category: 'Team Expansion', amount: 15, color: '#9CA3AF' },
  ];

  const competitiveAnalysis = [
    { metric: 'Market Share', us: 15, competitor1: 25, competitor2: 20 },
    { metric: 'Customer Satisfaction', us: 95, competitor1: 78, competitor2: 82 },
    { metric: 'Innovation Score', us: 90, competitor1: 65, competitor2: 70 },
    { metric: 'Price Competitiveness', us: 85, competitor1: 75, competitor2: 80 },
  ];

  useEffect(() => {
    const generateProposal = async () => {
      setIsGenerating(true);
      
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate generation time for better UX

      setIsGenerating(false);
    };

    generateProposal();
  }, [formData]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu && !(event.target as Element).closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  const downloadPDF = async () => {
    if (!proposalRef.current) {
      alert('Content not ready for PDF generation');
      return;
    }

    setIsDownloading(true);
    console.log('Starting PDF generation...');

    try {
      const element = proposalRef.current;
      console.log('Element to capture:', element);

      // Make sure element is visible and has content
      if (element.offsetWidth === 0 || element.offsetHeight === 0) {
        throw new Error('Element has no visible dimensions');
      }

      let canvas;
      try {
        console.log('Trying html2canvas with basic settings...');
        canvas = await html2canvas(element, {
          backgroundColor: '#111827',
          scale: 1,
          logging: true,
          useCORS: false,
          allowTaint: false
        });

        console.log('html2canvas result:', canvas);
        console.log('Canvas type:', typeof canvas);

      } catch (canvasError) {
        console.error('html2canvas failed:', canvasError);
        console.log('Trying with minimal settings...');

        // Try with absolute minimal settings
        try {
          canvas = await html2canvas(element, {
            backgroundColor: '#111827'
          });
        } catch (altError) {
          console.error('Minimal html2canvas also failed:', altError);
          const canvasErrorMessage = canvasError instanceof Error ? canvasError.message : 'Unknown canvas error';
          throw new Error(`html2canvas completely failed: ${canvasErrorMessage}`);
        }
      }

      console.log('Canvas result:', canvas);
      console.log('Canvas type:', typeof canvas);
      console.log('Canvas constructor:', canvas ? canvas.constructor.name : 'null');
      console.log('Canvas is HTMLCanvasElement:', canvas instanceof HTMLCanvasElement);

      if (!canvas) {
        throw new Error('html2canvas returned null or undefined');
      }

      if (typeof canvas.toDataURL !== 'function') {
        console.error('Canvas object:', canvas);
        console.error('Canvas properties:', Object.getOwnPropertyNames(canvas));
        throw new Error(`Canvas object does not have toDataURL method. Type: ${typeof canvas}, Constructor: ${canvas.constructor.name}`);
      }

      console.log('Getting image data from canvas...');
      const imgData = canvas.toDataURL('image/png', 0.8);
      console.log('Image data generated, length:', imgData.length);

      if (!imgData || imgData.length < 100) {
        throw new Error('Failed to generate image data from canvas');
      }

      console.log('Creating PDF...');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);

      // Calculate image dimensions to fit PDF width
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log('PDF page dimensions:', pdfWidth, 'x', pdfHeight);
      console.log('Content area dimensions:', contentWidth, 'x', contentHeight);
      console.log('Image dimensions for PDF:', imgWidth, 'x', imgHeight);

      if (imgHeight <= contentHeight) {
        // Single page - simple case
        console.log('Single page PDF');
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      } else {
        // Multiple pages - simplified approach
        console.log('Multiple pages needed');
        const totalPages = Math.ceil(imgHeight / contentHeight);
        console.log('Total pages:', totalPages);

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          const yOffset = page * contentHeight;
          const remainingHeight = imgHeight - yOffset;
          const currentPageHeight = Math.min(contentHeight, remainingHeight);

          console.log(`Page ${page + 1}: yOffset=${yOffset}, height=${currentPageHeight}`);

          // For simplicity, just add the full image and let it overflow
          // This ensures we don't lose content
          pdf.addImage(
            imgData,
            'PNG',
            margin,
            margin - yOffset,
            imgWidth,
            imgHeight
          );
        }
      }

      const fileName = `${formData.companyName.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-').toLowerCase()}-funding-proposal.pdf`;
      console.log('Saving PDF as:', fileName);

      pdf.save(fileName);
      console.log('PDF saved successfully');
      alert('PDF generated successfully!');

    } catch (error: unknown) {
      console.error('html2canvas method failed:', error);

      // Try dom-to-image as alternative
      try {
        console.log('Trying dom-to-image method...');
        await generatePDFWithDomToImage();
      } catch (domError: unknown) {
        console.error('dom-to-image method failed:', domError);

        // Try text-based PDF as final fallback
        try {
          console.log('Trying text-based PDF generation...');
          await generateTextBasedPDF();
        } catch (textError: unknown) {
          console.error('Text-based PDF also failed:', textError);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          alert(`Error generating PDF: ${errorMessage}. Please check the console for details.`);
        }
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const generatePDFWithDomToImage = async () => {
    if (!proposalRef.current) return;

    console.log('Using dom-to-image for PDF generation...');

    try {
      const element = proposalRef.current;

      // Use dom-to-image to create PNG
      const dataUrl = await domtoimage.toPng(element, {
        quality: 0.95,
        bgcolor: '#111827',
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      console.log('dom-to-image successful, creating PDF...');

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);

      // Create image to get dimensions
      const img = new Image();
      img.onload = () => {
        const imgWidth = contentWidth;
        const imgHeight = (img.height * imgWidth) / img.width;

        console.log('Image dimensions:', imgWidth, 'x', imgHeight);
        console.log('PDF page dimensions:', pdfWidth, 'x', pdfHeight);

        if (imgHeight <= contentHeight) {
          // Single page
          pdf.addImage(dataUrl, 'PNG', margin, margin, imgWidth, imgHeight);
        } else {
          // Multiple pages
          const totalPages = Math.ceil(imgHeight / contentHeight);
          console.log('Creating', totalPages, 'pages');

          for (let page = 0; page < totalPages; page++) {
            if (page > 0) {
              pdf.addPage();
            }

            const yOffset = page * contentHeight;
            pdf.addImage(
              dataUrl,
              'PNG',
              margin,
              margin - yOffset,
              imgWidth,
              imgHeight
            );
          }
        }

        const fileName = `${formData.companyName.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-').toLowerCase()}-funding-proposal.pdf`;
        pdf.save(fileName);
        console.log('dom-to-image PDF saved successfully');
        alert('PDF generated successfully with dom-to-image!');
      };

      img.src = dataUrl;

    } catch (error) {
      console.error('dom-to-image error:', error);
      throw error;
    }
  };

  const generateTextBasedPDF = async () => {
    console.log('Generating text-based PDF...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = margin;

    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont(undefined, 'bold');
      } else {
        pdf.setFont(undefined, 'normal');
      }

      const lines = pdf.splitTextToSize(text, pageWidth - (margin * 2));
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * lineHeight;
    };

    const addSpace = (space: number = lineHeight) => {
      yPosition += space;
    };

    // Generate PDF content
    addText(`${formData.companyName}`, 20, true);
    addText('Funding Proposal', 16, true);
    addSpace(10);

    addText('Executive Summary', 14, true);
    addSpace();
    addText(`Company: ${formData.companyName}`);
    addText(`Industry: ${formData.industry === 'other' ? formData.customIndustry : formData.industry}`);
    addText(`Funding Request: ${formData.fundingAmount}`);
    addText(`Business Model: ${formData.businessModel}`);
    addSpace();
    addText(`${formData.companyName} is seeking ${formData.fundingAmount} in funding to accelerate growth and market expansion in the ${formData.industry === 'other' ? formData.customIndustry : formData.industry} sector.`);
    addSpace(10);

    addText('Problem Statement', 14, true);
    addSpace();
    addText(formData.problemStatement);
    addSpace(10);

    addText('Our Solution', 14, true);
    addSpace();
    addText(formData.solution);
    addSpace(10);

    addText('Market Opportunity', 14, true);
    addSpace();
    addText('Target Market', 12, true);
    addText(formData.targetMarket);
    addSpace();
    addText('Market Segmentation', 12, true);
    addText(formData.marketSegmentation);
    addSpace(10);

    addText('Team Structure', 14, true);
    addSpace();
    addText(formData.teamStructure);
    addSpace(10);

    addText('Financial Projections', 14, true);
    addSpace();
    addText(formData.financialProjections);
    addSpace();
    addText('Revenue Forecast: Our financial projections show strong growth potential with projected revenues reaching $2M by Year 5.');
    addSpace(10);

    addText('Use of Funds', 14, true);
    addSpace();
    addText(formData.useOfFunds);
    addSpace();
    addText('Funding Allocation:');
    addText('• Product Development (40%): Enhancing core features and technology');
    addText('• Marketing & Sales (25%): Customer acquisition and brand building');
    addText('• Operations (20%): Infrastructure and operational scaling');
    addText('• Team Expansion (15%): Hiring key personnel');
    addSpace(10);

    addText('Investment Highlights', 14, true);
    addSpace();
    addText('• Scalable Business Model: Proven ability to scale operations efficiently');
    addText('• Strong Market Demand: Growing market with significant opportunity');
    addText('• Experienced Team: Skilled professionals with industry expertise');
    addText('• Clear Growth Strategy: Well-defined path to profitability and expansion');
    addSpace(10);

    addText('Next Steps', 14, true);
    addSpace();
    addText('1. Due Diligence: Comprehensive review of business metrics and projections');
    addText('2. Term Sheet: Negotiation of investment terms and conditions');
    addText('3. Legal Documentation: Finalization of investment agreements');
    addText('4. Funding Deployment: Strategic allocation of funds according to plan');
    addSpace(10);

    addText(`This proposal was generated on ${new Date().toLocaleDateString()} for ${formData.companyName}.`, 10);

    const fileName = `${formData.companyName.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-').toLowerCase()}-funding-proposal.pdf`;
    pdf.save(fileName);

    console.log('Text-based PDF generated successfully');
    alert('PDF generated successfully (text version)!');
  };



  const handleShare = async () => {
    const shareData = {
      title: `${formData.companyName} - Funding Proposal`,
      text: `Check out the funding proposal for ${formData.companyName}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${formData.companyName} - Funding Proposal`);
    const body = encodeURIComponent(`I'd like to share the funding proposal for ${formData.companyName}. Please check it out at: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setShowShareMenu(false);
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center" style={{paddingTop: '120px', paddingBottom: '40px'}}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Generating Your Funding Proposal</h2>
          <p className="text-gray-300">Creating comprehensive pitch deck with visualizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 overflow-y-auto" style={{paddingTop: '120px', paddingBottom: '40px'}}>
      <div className="min-h-full px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-gray-300 hover:text-white transition-colors mr-4"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <h1 className="text-3xl font-bold text-white">{formData.companyName} - Funding Proposal</h1>
            </div>

            <div className="flex items-center space-x-3 relative" data-html2canvas-ignore="true">
              <button
                onClick={testHtml2Canvas}
                className="bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center space-x-2 mr-2"
              >
                <span>Test</span>
              </button>
              <button
                onClick={downloadPDF}
                disabled={isDownloading}
                className={`bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center space-x-2 ${
                  isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              <div className="relative share-menu-container">
                <button
                  onClick={handleShare}
                  className="text-black font-medium py-2 px-4 rounded-lg hover:opacity-80 transition-all flex items-center space-x-2"
                  style={{background: '#ffee99'}}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <button
                        onClick={copyToClipboard}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2"
                      >
                        {copySuccess ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={shareViaEmail}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2"
                      >
                        <span>📧</span>
                        <span>Share via Email</span>
                      </button>
                      <button
                        onClick={() => setShowShareMenu(false)}
                        className="w-full text-left px-3 py-2 text-gray-400 hover:bg-gray-700 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div ref={proposalRef} className="grid lg:grid-cols-2 gap-8">
            {/* Formatted Proposal Content */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Eye className="w-5 h-5 mr-2" style={{color: '#ffee99'}} />
                <h2 className="text-xl font-bold text-white">Proposal Document</h2>
              </div>
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-gray-300 space-y-6">
                  {/* Title */}
                  <div className="border-b border-gray-700 pb-4">
                    <h1 className="text-2xl font-bold text-white mb-2">{formData.companyName}</h1>
                    <p className="text-lg" style={{color: '#ffee99'}}>Funding Proposal</p>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Executive Summary</h2>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div><span className="font-semibold text-gray-400">Company:</span> {formData.companyName}</div>
                        <div><span className="font-semibold text-gray-400">Industry:</span> {formData.industry === 'other' ? formData.customIndustry : formData.industry}</div>
                        <div><span className="font-semibold text-gray-400">Funding Request:</span> {formData.fundingAmount}</div>
                        <div><span className="font-semibold text-gray-400">Business Model:</span> {formData.businessModel}</div>
                      </div>
                      <p className="mt-4 text-gray-300 leading-relaxed">
                        {formData.companyName} is seeking {formData.fundingAmount} in funding to accelerate growth and market expansion in the {formData.industry === 'other' ? formData.customIndustry : formData.industry} sector.
                      </p>
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Problem Statement</h2>
                    <p className="text-gray-300 leading-relaxed text-sm">{formData.problemStatement}</p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Our Solution</h2>
                    <p className="text-gray-300 leading-relaxed text-sm">{formData.solution}</p>
                  </div>

                  {/* Market Opportunity */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Market Opportunity</h2>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2">Target Market</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">{formData.targetMarket}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2">Market Segmentation</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">{formData.marketSegmentation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Team Structure */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Team Structure</h2>
                    <p className="text-gray-300 leading-relaxed text-sm">{formData.teamStructure}</p>
                  </div>

                  {/* Financial Projections */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Financial Projections</h2>
                    <p className="text-gray-300 leading-relaxed text-sm mb-3">{formData.financialProjections}</p>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Revenue Forecast</h4>
                      <p className="text-xs text-gray-400">Our financial projections show strong growth potential with projected revenues reaching $2M by Year 5.</p>
                    </div>
                  </div>

                  {/* Use of Funds */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Use of Funds</h2>
                    <p className="text-gray-300 leading-relaxed text-sm mb-3">{formData.useOfFunds}</p>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Funding Allocation</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• <span className="font-medium">Product Development (40%):</span> Enhancing core features and technology</li>
                        <li>• <span className="font-medium">Marketing & Sales (25%):</span> Customer acquisition and brand building</li>
                        <li>• <span className="font-medium">Operations (20%):</span> Infrastructure and operational scaling</li>
                        <li>• <span className="font-medium">Team Expansion (15%):</span> Hiring key personnel</li>
                      </ul>
                    </div>
                  </div>

                  {/* Investment Highlights */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Investment Highlights</h2>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <div><span className="font-medium">Scalable Business Model:</span> Proven ability to scale operations efficiently</div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <div><span className="font-medium">Strong Market Demand:</span> Growing market with significant opportunity</div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <div><span className="font-medium">Experienced Team:</span> Skilled professionals with industry expertise</div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <div><span className="font-medium">Clear Growth Strategy:</span> Well-defined path to profitability and expansion</div>
                      </li>
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Next Steps</h2>
                    <ol className="text-sm text-gray-300 space-y-2">
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2 font-bold">1.</span>
                        <div><span className="font-medium">Due Diligence:</span> Comprehensive review of business metrics and projections</div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2 font-bold">2.</span>
                        <div><span className="font-medium">Term Sheet:</span> Negotiation of investment terms and conditions</div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2 font-bold">3.</span>
                        <div><span className="font-medium">Legal Documentation:</span> Finalization of investment agreements</div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2 font-bold">4.</span>
                        <div><span className="font-medium">Funding Deployment:</span> Strategic allocation of funds according to plan</div>
                      </li>
                    </ol>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-700 pt-4 mt-6">
                    <p className="text-xs text-gray-500 italic">
                      This proposal was generated on {new Date().toLocaleDateString()} for {formData.companyName}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visualizations */}
            <div className="space-y-6">
              {/* Financial Projections Chart */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Financial Projections</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={financialData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="year"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                      tickFormatter={(value) => `$${(value / 1000)}K`}
                    />
                    <Tooltip
                      formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                      labelFormatter={(label) => `Year: ${label}`}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#ffee99" name="Revenue" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="expenses" fill="#6B7280" name="Expenses" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#ffee99' }}></div>
                    <span className="text-sm text-gray-300">Revenue</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#6B7280' }}></div>
                    <span className="text-sm text-gray-300">Expenses</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#10B981' }}></div>
                    <span className="text-sm text-gray-300">Profit</span>
                  </div>
                </div>
              </div>

              {/* Market Segmentation Chart */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Market Segmentation</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={marketSegmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      innerRadius={30}
                      dataKey="value"
                      label={({ value }) => `${value}%`}
                    >
                      {marketSegmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {marketSegmentData.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm text-gray-300">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funding Breakdown Chart */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Use of Funds</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fundingBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      innerRadius={30}
                      dataKey="amount"
                      label={({ amount }) => `${amount}%`}
                    >
                      {fundingBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {fundingBreakdown.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm text-gray-300">{entry.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Structure Org Chart */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Team Structure</h3>
                <div className="space-y-4">
                  {/* CEO Level */}
                  <div className="flex justify-center">
                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-center">
                      CEO/Founder
                    </div>
                  </div>

                  {/* Department Heads */}
                  <div className="flex justify-center space-x-4">
                    <div className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm text-center">
                      CTO
                    </div>
                    <div className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm text-center">
                      CMO
                    </div>
                    <div className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm text-center">
                      CFO
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-center">
                      Dev Team
                    </div>
                    <div className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-center">
                      Marketing
                    </div>
                    <div className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-center">
                      Operations
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Metrics */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">5x</div>
                    <div className="text-sm text-gray-300">Revenue Growth</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">40%</div>
                    <div className="text-sm text-gray-300">Profit Margin</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">2M</div>
                    <div className="text-sm text-gray-300">Target Market</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">18mo</div>
                    <div className="text-sm text-gray-300">Break-even</div>
                  </div>
                </div>
              </div>

              {/* Competitive Analysis */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Competitive Analysis</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={competitiveAnalysis}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="metric"
                      stroke="#9CA3AF"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      domain={[0, 100]}
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Bar dataKey="us" fill="#ffee99" name="Our Company" />
                    <Bar dataKey="competitor1" fill="#6B7280" name="Competitor A" />
                    <Bar dataKey="competitor2" fill="#9CA3AF" name="Competitor B" />
                  </BarChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#ffee99' }}></div>
                    <span className="text-sm text-gray-300">Our Company</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#6B7280' }}></div>
                    <span className="text-sm text-gray-300">Competitor A</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: '#9CA3AF' }}></div>
                    <span className="text-sm text-gray-300">Competitor B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingProposal;
