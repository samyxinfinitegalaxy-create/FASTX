import React from 'react';
import { Server, FolderOpen, Code, Database, CheckCircle } from './Icons';

export const DeploymentGuide: React.FC = () => {
  const phpCode = `<?php
// filename: api.php
// Place this in C:\\xampp\\htdocs\\monoprint\\api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database Configuration
$host = "localhost";
$user = "root";
$pass = "";
$db   = "monoprint_db";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Read JSON Input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

// 1. Insert Order
$order_sql = "INSERT INTO orders (order_unique_id, customer_name, total_amount, delivery_mode, is_express, special_instructions, status) VALUES (?, ?, ?, ?, ?, ?, 'paid')";
$stmt = $conn->prepare($order_sql);

// Generate a random Order ID
$order_ref = "ORD-" . strtoupper(substr(md5(time()), 0, 6));
$cust_name = "Guest User"; // You can add a name field to the form later

$stmt->bind_param("ssdsis", $order_ref, $cust_name, $data['totalCost'], $data['deliveryMode'], $data['isExpress'], $data['specialInstructions']);

if ($stmt->execute()) {
    $order_id = $stmt->insert_id;

    // 2. Insert Payment
    $pay_sql = "INSERT INTO payments (order_id, transaction_ref_no, amount, payment_method) VALUES (?, ?, ?, 'UPI_FAM')";
    $pay_stmt = $conn->prepare($pay_sql);
    $pay_stmt->bind_param("isd", $order_id, $data['txnId'], $data['totalCost']);
    $pay_stmt->execute();

    // 3. Insert File Details
    $file_sql = "INSERT INTO order_files (order_id, file_name, file_size_bytes, page_count, copies, paper_size, color_mode, paper_type, binding_type, double_sided, gemini_analysis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $file_stmt = $conn->prepare($file_sql);

    foreach ($data['files'] as $file) {
        $dbl = $data['settings']['doubleSided'] ? 1 : 0;
        $file_stmt->bind_param(
            "isiisssssis", 
            $order_id, 
            $file['name'], 
            $file['size'], 
            $data['settings']['pagesPerCopy'], 
            $data['settings']['copies'],
            $data['settings']['paperSize'],
            $data['settings']['colorMode'],
            $data['settings']['paperType'],
            $data['settings']['binding'],
            $dbl,
            $file['analysis']
        );
        $file_stmt->execute();
    }

    echo json_encode(["status" => "success", "order_id" => $order_ref]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$conn->close();
?>`;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Server className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Deploy to XAMPP</h1>
        <p className="text-zinc-400">Follow these steps to turn this React App into a working XAMPP Service.</p>
      </div>

      <div className="space-y-8">
        
        {/* Step 1: Folder Setup */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <FolderOpen className="w-5 h-5 text-indigo-400" /> 1. Create Folder in htdocs
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
                Go to your XAMPP installation directory and create a new folder.
            </p>
            <div className="bg-black rounded-lg p-4 font-mono text-sm text-zinc-300 border border-zinc-800">
                C:\xampp\htdocs\<span className="text-white font-bold">monoprint</span>
            </div>
        </div>

        {/* Step 2: The Backend Code */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-emerald-400" /> 2. Create the Backend API
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
                Create a file named <span className="text-white font-mono bg-zinc-800 px-1 rounded">api.php</span> inside that folder and paste the code below.
                This script connects the frontend to the MySQL database you created earlier.
            </p>
            <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-zinc-800">
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-800">
                    <span className="text-xs text-zinc-500 font-mono">api.php</span>
                    <button 
                        onClick={() => navigator.clipboard.writeText(phpCode)}
                        className="text-xs text-indigo-400 hover:text-white transition-colors"
                    >
                        Copy Code
                    </button>
                </div>
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap h-64">
                    {phpCode}
                </pre>
            </div>
        </div>

        {/* Step 3: The Frontend */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-purple-400" /> 3. Connect Frontend
            </h3>
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                <p>
                    Since this is a React app, you usually need to run <code className="text-white bg-zinc-800 px-1 rounded">npm run build</code> to create the files for XAMPP.
                </p>
                <p>
                    <strong>For this Demo:</strong> Since you are viewing this in a browser, the frontend is simulating the backend. 
                </p>
                <p>
                    <strong>For Real Production:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                        <li>Open <code className="text-white bg-zinc-800 px-1 rounded">App.tsx</code></li>
                        <li>Find the <code className="text-white bg-zinc-800 px-1 rounded">handleOrderSuccess</code> function.</li>
                        <li>Replace the <code className="text-white bg-zinc-800 px-1 rounded">setOrderInfo</code> logic with a <code className="text-white bg-zinc-800 px-1 rounded">fetch()</code> call to your new API:</li>
                    </ul>
                </p>
                <div className="bg-black rounded-lg p-4 font-mono text-xs text-zinc-300 border border-zinc-800 mt-2">
{`const response = await fetch('http://localhost/monoprint/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        txnId, 
        totalCost, 
        files, 
        settings 
    })
});`}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};