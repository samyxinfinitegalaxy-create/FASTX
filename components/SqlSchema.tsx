import React from 'react';
import { Download, Database, ChevronRight } from './Icons';

export const SqlSchema: React.FC = () => {
  const sqlCode = `-- MonoPrint Database Schema
-- Version: 1.0.0
-- Database: monoprint_db

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+05:30";

-- --------------------------------------------------------

--
-- Database: \`monoprint_db\`
--
CREATE DATABASE IF NOT EXISTS \`monoprint_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE \`monoprint_db\`;

-- --------------------------------------------------------

--
-- Table structure for table \`orders\`
--

CREATE TABLE \`orders\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`order_unique_id\` varchar(50) NOT NULL COMMENT 'Public Order ID (e.g. #ORD-123456)',
  \`customer_name\` varchar(100) DEFAULT NULL,
  \`total_amount\` decimal(10,2) NOT NULL,
  \`status\` enum('pending','paid','processing','completed','cancelled') NOT NULL DEFAULT 'pending',
  \`delivery_mode\` enum('pickup','delivery') NOT NULL DEFAULT 'pickup',
  \`is_express\` tinyint(1) NOT NULL DEFAULT 0,
  \`special_instructions\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`order_unique_id\` (\`order_unique_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table \`order_files\`
--

CREATE TABLE \`order_files\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`order_id\` int(11) NOT NULL,
  \`file_name\` varchar(255) NOT NULL,
  \`file_size_bytes\` bigint(20) NOT NULL,
  \`page_count\` int(11) NOT NULL DEFAULT 1,
  \`copies\` int(11) NOT NULL DEFAULT 1,
  \`paper_size\` enum('A4','A3','Legal') NOT NULL DEFAULT 'A4',
  \`color_mode\` enum('B&W','Color') NOT NULL DEFAULT 'B&W',
  \`paper_type\` varchar(50) NOT NULL DEFAULT 'Standard',
  \`binding_type\` varchar(50) NOT NULL DEFAULT 'None',
  \`double_sided\` tinyint(1) NOT NULL DEFAULT 0,
  \`gemini_analysis\` text DEFAULT NULL,
  \`file_path\` varchar(255) DEFAULT NULL COMMENT 'Path to stored file on server',
  PRIMARY KEY (\`id\`),
  KEY \`order_id\` (\`order_id\`),
  CONSTRAINT \`fk_order_files\` FOREIGN KEY (\`order_id\` REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table \`payments\`
--

CREATE TABLE \`payments\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`order_id\` int(11) NOT NULL,
  \`transaction_ref_no\` varchar(50) NOT NULL COMMENT 'UPI Reference Number (UTRN)',
  \`amount\` decimal(10,2) NOT NULL,
  \`payment_method\` varchar(50) NOT NULL DEFAULT 'UPI_QR',
  \`status\` enum('verified','failed') NOT NULL DEFAULT 'verified',
  \`payment_date\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`transaction_ref_no\` (\`transaction_ref_no\`),
  KEY \`order_id\` (\`order_id\`),
  CONSTRAINT \`fk_order_payments\` FOREIGN KEY (\`order_id\` REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #sql-print-area, #sql-print-area * {
            visibility: visible;
          }
          #sql-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            color: black;
            padding: 20px;
          }
          /* Hide button in print */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-400" />
            Database Schema
          </h1>
          <p className="text-zinc-400 mt-1">MySQL structure for XAMPP integration</p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors no-print"
        >
          <Download className="w-4 h-4" />
          Save as PDF
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
           <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
           </div>
           <span className="text-xs text-zinc-500 ml-2 font-mono">database_schema.sql</span>
        </div>
        
        <div id="sql-print-area" className="p-6 overflow-x-auto bg-[#1e1e1e]">
          <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap">
            {sqlCode}
          </pre>
        </div>
      </div>

      <div className="mt-8 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 no-print">
        <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
          <ChevronRight className="w-4 h-4" /> Instructions
        </h3>
        <ol className="list-decimal list-inside text-zinc-400 space-y-2 text-sm">
          <li>Click the <strong>"Save as PDF"</strong> button above.</li>
          <li>In the print dialog, select <strong>"Save as PDF"</strong> as the destination.</li>
          <li>Save the file as <code>monoprint_schema.pdf</code>.</li>
          <li>You can also copy the text directly into phpMyAdmin to set up your database.</li>
        </ol>
      </div>
    </div>
  );
};