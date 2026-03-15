<?php
/**
 * ============================================================================
 *  SAKSAAS — Complete Backend API  (auth.php)
 *  All 34 actions in one file
 *
 *  QUICK SETUP:
 *  1. Import database_schema.sql into MySQL
 *  2. Set DB credentials below
 *  3. Set RAZORPAY keys
 *  4. Set SMTP email settings (or use mail())
 *  5. Place file at: C:/xampp/htdocs/saksaas/auth.php
 * ============================================================================
 */

// ─── CORS ─────────────────────────────────────────────────────────────────────
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

// ─── CONFIG ───────────────────────────────────────────────────────────────────
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Database
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'saksaas');

// Razorpay — get from razorpay.com/dashboard → Settings → API Keys
define('RAZORPAY_KEY_ID',     'rzp_test_YOUR_KEY_ID');
define('RAZORPAY_KEY_SECRET', 'YOUR_KEY_SECRET');

// Site
define('SITE_URL',   'http://localhost/saksaas');
define('SITE_NAME',  'SAKSAAS Artisan Jewellery');
define('FROM_EMAIL', 'praveenc102001@gmail.com'); // ← must be the same Gmail you use for SMTP
define('FROM_NAME',  'SAKSAAS');

// Gmail SMTP — How to get your App Password:
// 1. Go to myaccount.google.com → Security → 2-Step Verification → turn ON
// 2. Then go to myaccount.google.com/apppasswords
// 3. Create an app password → name it "SAKSAAS" → copy the 16-char password
// 4. Paste it below (no spaces)
define('SMTP_HOST',     'smtp.gmail.com');
define('SMTP_PORT',     587);
define('SMTP_USER',     'praveenc102001@gmail.com'); // ← your Gmail
define('SMTP_PASS',     'xxxx xxxx xxxx xxxx');      // ← paste your 16-char App Password here
define('SMTP_SECURE',   'tls');

// Admin email (receives contact form messages and order copies)
define('ADMIN_EMAIL', 'praveenc102001@gmail.com'); // ← your Gmail — all emails arrive here

// Upload base path (relative to this file)
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('UPLOAD_URL',  '/uploads/');

// ─── DATABASE ─────────────────────────────────────────────────────────────────
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    http_response_code(500);
    exit(json_encode(["success" => false, "message" => "DB connection failed: " . $conn->connect_error]));
}
$conn->set_charset("utf8mb4");

// ─── REQUEST PARSING ─────────────────────────────────────────────────────────
$data = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ct = $_SERVER['CONTENT_TYPE'] ?? '';
    if (strpos($ct, 'application/json') !== false) {
        $data = json_decode(file_get_contents("php://input"), true);
    }
}
$action = $_GET['action'] ?? '';

// ─── ROUTER ──────────────────────────────────────────────────────────────────
switch ($action) {
    case 'login':                           handleLogin($conn, $data);                      break;
    case 'signup':                          handleSignup($conn, $data);                     break;
    case 'getProfile':                      handleGetProfile($conn, $data);                 break;
    case 'updateProfile':                   handleUpdateProfile($conn, $data);              break;
    case 'uploadImage':                     handleUploadImage($conn);                       break;
    case 'changePassword':                  handleChangePassword($conn, $data);             break;
    case 'getCategories':                   handleGetCategories($conn);                     break;
    case 'getProducts':                     handleGetProducts($conn);                       break;
    case 'getProductById':                  handleGetProductById($conn);                    break;
    case 'createOrder':                     handleCreateOrder($conn, $data);                break;
    case 'getOrders':                       handleGetOrders($conn, $data);                  break;
    case 'getOrderById':                    handleGetOrderById($conn, $data);               break;
    case 'cancelOrder':                     handleCancelOrder($conn, $data);                break;
    case 'getTrackingByNumber':             handleGetTrackingByNumber($conn, $data);        break;
    case 'getWishlist':                     handleGetWishlist($conn, $data);                break;
    case 'addToWishlist':                   handleAddToWishlist($conn, $data);              break;
    case 'removeFromWishlist':              handleRemoveFromWishlist($conn, $data);         break;
    case 'getNotifications':                handleGetNotifications($conn, $data);           break;
    case 'markNotificationRead':            handleMarkNotificationRead($conn, $data);       break;
    case 'markAllRead':                     handleMarkAllRead($conn, $data);                break;
    case 'submitCustomRequest':             handleSubmitCustomRequest($conn);               break;
    case 'getMyCustomRequests':             handleGetMyCustomRequests($conn, $data);        break;
    case 'sendContactEmail':                handleSendContactEmail($data);                  break;
    case 'createRazorpayOrder':             handleCreateRazorpayOrder($conn, $data);        break;
    case 'verifyPayment':                   handleVerifyPayment($conn, $data);              break;
    case 'adminGetDashboardStats':          adminGetDashboardStats($conn, $data);           break;
    case 'adminGetAllOrders':               adminGetAllOrders($conn, $data);                break;
    case 'adminUpdateOrderStatus':          adminUpdateOrderStatus($conn, $data);           break;
    case 'adminGetAllUsers':                adminGetAllUsers($conn, $data);                 break;
    case 'adminAddProduct':                 adminAddProduct($conn);                         break;
    case 'adminUpdateProduct':              adminUpdateProduct($conn, $data);               break;
    case 'adminUpdateProductImage':         adminUpdateProductImage($conn);                 break;
    case 'adminDeleteProductImage':         adminDeleteProductImage($conn, $data);          break;
    case 'adminDeleteProduct':              adminDeleteProduct($conn, $data);               break;
    case 'adminGetProductById':             adminGetProductById($conn, $data);              break;
    case 'adminGetCustomRequests':          adminGetCustomRequests($conn, $data);           break;
    case 'adminUpdateCustomRequestStatus':  adminUpdateCustomRequestStatus($conn, $data);   break;
    default:
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Unknown action: " . htmlspecialchars($action)]);
}
$conn->close();

// ============================================================================
//  HELPERS
// ============================================================================
function getUserByEmail($conn, $email) {
    $s = $conn->prepare("SELECT * FROM Users WHERE Email = ?");
    if (!$s) return null;
    $s->bind_param("s", $email);
    $s->execute();
    $r = $s->get_result()->fetch_assoc();
    $s->close();
    return $r;
}
function requireAdmin($conn, $email) {
    $u = getUserByEmail($conn, $email);
    if (!$u || $u['Role'] !== 'Admin') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Admin access required"]);
        return null;
    }
    return $u;
}
function formatUser($r) {
    return [
        'id' => $r['UserID'], 'fullName' => $r['FullName'], 'email' => $r['Email'],
        'role' => $r['Role'], 'phone' => $r['Phone'], 'addressLine1' => $r['AddressLine1'],
        'city' => $r['City'], 'pincode' => $r['Pincode'], 'profileImage' => $r['ProfileImage'],
    ];
}
function createNotification($conn, $userId, $title, $message, $type = 'order', $link = '') {
    $s = $conn->prepare("INSERT INTO Notifications (UserID,Title,Message,Type,LinkURL) VALUES (?,?,?,?,?)");
    if (!$s) return;
    $s->bind_param("issss", $userId, $title, $message, $type, $link);
    $s->execute(); $s->close();
}
function saveFile($key, $subDir, $prefix = 'file') {
    if (!isset($_FILES[$key]) || $_FILES[$key]['error'] !== UPLOAD_ERR_OK) return false;
    $f = $_FILES[$key];
    $allowed = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
    if (!in_array($f['type'], $allowed)) return false;
    $dir = UPLOAD_PATH . $subDir . '/';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $ext  = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
    $name = $prefix . '_' . uniqid() . '.' . $ext;
    if (!move_uploaded_file($f['tmp_name'], $dir . $name)) return false;
    return UPLOAD_URL . $subDir . '/' . $name;
}

/**
 * Send email via Gmail SMTP (PHPMailer) with PHP mail() fallback.
 *
 * ── OPTION A — PHPMailer (recommended, actually delivers to Gmail) ──
 * 1. Download 3 files from: https://github.com/PHPMailer/PHPMailer/tree/master/src
 *    - Exception.php  |  PHPMailer.php  |  SMTP.php
 * 2. Put all 3 in: C:/xampp/htdocs/saksaas/PHPMailer/
 * 3. Set SMTP_PASS above to your Gmail App Password
 *    (myaccount.google.com → Security → App Passwords)
 *
 * ── OPTION B — PHP mail() fallback ──
 * Works on some servers. On XAMPP localhost it usually doesn't
 * deliver to real inboxes but won't crash the site.
 *
 * $replyTo — if set, replies go to this address (e.g. user's email)
 */
function sendEmail($to, $toName, $subject, $htmlBody, $replyTo = '') {
    $base = __DIR__ . '/PHPMailer/';

    // ── Try PHPMailer first ───────────────────────────────────────────────
    if (file_exists($base . 'PHPMailer.php')) {
        require_once $base . 'Exception.php';
        require_once $base . 'PHPMailer.php';
        require_once $base . 'SMTP.php';

        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USER;
            $mail->Password   = SMTP_PASS;
            $mail->SMTPSecure = SMTP_SECURE;
            $mail->Port       = SMTP_PORT;
            $mail->CharSet    = 'UTF-8';
            $mail->setFrom(FROM_EMAIL, FROM_NAME);
            if ($replyTo) $mail->addReplyTo($replyTo);
            $mail->addAddress($to, $toName);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('PHPMailer error: ' . $mail->ErrorInfo);
            // Fall through to mail() fallback
        }
    }

    // ── Fallback: PHP built-in mail() ────────────────────────────────────
    $headers  = "MIME-Version: 1.0
";
    $headers .= "Content-Type: text/html; charset=UTF-8
";
    $headers .= "From: " . FROM_NAME . " <" . FROM_EMAIL . ">
";
    if ($replyTo) $headers .= "Reply-To: {$replyTo}
";
    $headers .= "X-Mailer: PHP/" . phpversion();
    $result = @mail($to, $subject, $htmlBody, $headers);
    if (!$result) error_log("mail() failed sending to: $to");
    return $result;
}

/** Generate a clean HTML invoice for emails and frontend rendering */
function generateInvoiceHTML($order, $items, $isEmail = false) {
    $rows = '';
    $subtotal = 0;
    foreach ($items as $item) {
        $lineTotal = $item['UnitPrice'] * $item['Quantity'];
        $subtotal += $lineTotal;
        $size = $item['Size'] ?? $item['SelectedSize'] ?? '-';
        $rows .= "<tr>
            <td style='padding:12px 8px;border-bottom:1px solid #f0f0f0;'>
                <strong style='color:#1a1a1a;'>{$item['Name']}</strong><br>
                <small style='color:#888;'>Size: {$size} | Qty: {$item['Quantity']}</small>
            </td>
            <td style='padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:right;'>₹" . number_format($item['UnitPrice'], 2) . "</td>
            <td style='padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold;'>₹" . number_format($lineTotal, 2) . "</td>
        </tr>";
    }
    $shipping = $subtotal > 1500 ? 0 : 100;
    $gst      = $subtotal * 0.03;
    $total    = $subtotal + $shipping + $gst;
    $orderDate = date('d M Y', strtotime($order['OrderDate']));
    return "
    <div style='font-family:Georgia,serif;max-width:700px;margin:0 auto;background:#fff;'>
      <div style='background:#166534;padding:32px;text-align:center;'>
        <h1 style='color:#fff;font-size:28px;margin:0;letter-spacing:4px;'>SAKSAAS</h1>
        <p style='color:#dcfce7;margin:8px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;'>Artisan Jewellery</p>
      </div>
      <div style='padding:32px;background:#f9fafb;border-bottom:1px solid #e5e7eb;'>
        <table width='100%'><tr>
          <td>
            <h2 style='color:#166534;margin:0 0 4px;'>Tax Invoice</h2>
            <p style='color:#6b7280;margin:0;font-size:13px;font-family:sans-serif;'>Order #{$order['OrderID']}</p>
          </td>
          <td style='text-align:right;'>
            <p style='color:#374151;margin:0;font-size:13px;font-family:sans-serif;'>Date: <strong>{$orderDate}</strong></p>
            <p style='color:#374151;margin:4px 0 0;font-size:13px;font-family:sans-serif;'>Status: <span style='color:#166534;font-weight:bold;'>{$order['Status']}</span></p>
            <p style='color:#374151;margin:4px 0 0;font-size:13px;font-family:sans-serif;'>Payment: {$order['PaymentMethod']}</p>
          </td>
        </tr></table>
      </div>
      <div style='padding:24px 32px;'>
        <h3 style='color:#374151;font-size:14px;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;font-family:sans-serif;'>Ship To</h3>
        <p style='color:#6b7280;font-size:13px;font-family:sans-serif;margin:0;line-height:1.6;'>{$order['ShippingAddress']}</p>
      </div>
      <div style='padding:0 32px 32px;'>
        <table width='100%' style='border-collapse:collapse;'>
          <thead>
            <tr style='background:#f0fdf4;'>
              <th style='padding:12px 8px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#166534;font-family:sans-serif;'>Item</th>
              <th style='padding:12px 8px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#166534;font-family:sans-serif;'>Price</th>
              <th style='padding:12px 8px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#166534;font-family:sans-serif;'>Total</th>
            </tr>
          </thead>
          <tbody>{$rows}</tbody>
        </table>
        <table width='100%' style='margin-top:16px;'>
          <tr><td style='font-family:sans-serif;font-size:13px;color:#6b7280;padding:4px 8px;'>Subtotal</td><td style='text-align:right;font-family:sans-serif;font-size:13px;padding:4px 8px;'>₹" . number_format($subtotal, 2) . "</td></tr>
          <tr><td style='font-family:sans-serif;font-size:13px;color:#6b7280;padding:4px 8px;'>Shipping</td><td style='text-align:right;font-family:sans-serif;font-size:13px;padding:4px 8px;color:" . ($shipping == 0 ? '#16a34a' : '#374151') . ";'>" . ($shipping == 0 ? 'FREE' : '₹100') . "</td></tr>
          <tr><td style='font-family:sans-serif;font-size:13px;color:#6b7280;padding:4px 8px;'>GST (3%)</td><td style='text-align:right;font-family:sans-serif;font-size:13px;padding:4px 8px;'>₹" . number_format($gst, 2) . "</td></tr>
          <tr style='background:#f0fdf4;'>
            <td style='font-family:sans-serif;font-size:16px;font-weight:bold;color:#166534;padding:12px 8px;'>Total Paid</td>
            <td style='text-align:right;font-family:sans-serif;font-size:16px;font-weight:bold;color:#166534;padding:12px 8px;'>₹" . number_format($total, 2) . "</td>
          </tr>
        </table>
      </div>
      <div style='background:#f9fafb;padding:24px 32px;text-align:center;border-top:1px solid #e5e7eb;'>
        <p style='color:#9ca3af;font-size:12px;font-family:sans-serif;margin:0;'>Thank you for shopping with SAKSAAS · hello@saksaas.com · +91 98765 43210</p>
        <p style='color:#d1d5db;font-size:11px;font-family:sans-serif;margin:4px 0 0;'>123 Artisan Lane, Bangalore, Karnataka 560001</p>
      </div>
    </div>";
}

/** Send order confirmation email with invoice to customer */
function sendOrderConfirmationEmail($conn, $orderId, $userEmail, $userName) {
    // Fetch order
    $s = $conn->prepare("SELECT * FROM Orders WHERE OrderID = ?");
    $s->bind_param("i", $orderId); $s->execute();
    $order = $s->get_result()->fetch_assoc(); $s->close();
    if (!$order) return;

    // Fetch items
    $s = $conn->prepare("SELECT * FROM OrderItems WHERE OrderID = ?");
    $s->bind_param("i", $orderId); $s->execute();
    $items = $s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();

    $invoice = generateInvoiceHTML($order, $items, true);
    $subject = "Order #{$orderId} Confirmed — " . SITE_NAME;
    $body = "
    <div style='font-family:sans-serif;max-width:700px;margin:0 auto;'>
      <p style='color:#374151;font-size:15px;'>Hi <strong>{$userName}</strong>,</p>
      <p style='color:#6b7280;font-size:14px;'>Your order has been confirmed. Here is your invoice:</p>
      {$invoice}
      <p style='color:#6b7280;font-size:13px;margin-top:24px;'>You can track your order at: <a href='" . SITE_URL . "/#/order/{$orderId}' style='color:#166534;'>View Order</a></p>
    </div>";

    sendEmail($userEmail, $userName, $subject, $body);

    // Also send copy to admin
    sendEmail(ADMIN_EMAIL, FROM_NAME, "[New Order] #{$orderId} from {$userName}", $body);
}

// ============================================================================
//  AUTH
// ============================================================================
function handleLogin($conn, $data) {
    $email = trim($data['email'] ?? ''); $pass = trim($data['password'] ?? '');
    if (!$email || !$pass) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Email and password required"]); return; }
    $u = getUserByEmail($conn, $email);
    if (!$u) { http_response_code(401); echo json_encode(["success"=>false,"message"=>"Email not found"]); return; }
    if (!password_verify($pass, $u['PasswordHash'])) { http_response_code(401); echo json_encode(["success"=>false,"message"=>"Incorrect password"]); return; }
    echo json_encode(["success"=>true,"message"=>"Login successful","user"=>formatUser($u)]);
}
function handleSignup($conn, $data) {
    $name = trim($data['fullName'] ?? ''); $email = trim($data['email'] ?? ''); $pass = trim($data['password'] ?? '');
    if (!$name||!$email||!$pass) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"All fields required"]); return; }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Invalid email"]); return; }
    if (strlen($pass) < 6) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Password min 6 chars"]); return; }
    $s = $conn->prepare("SELECT UserID FROM Users WHERE Email=?"); $s->bind_param("s",$email); $s->execute();
    if ($s->get_result()->num_rows>0) { http_response_code(409); echo json_encode(["success"=>false,"message"=>"Email already registered"]); $s->close(); return; }
    $s->close();
    $hash = password_hash($pass, PASSWORD_BCRYPT);
    $s = $conn->prepare("INSERT INTO Users(FullName,Email,PasswordHash,Role) VALUES(?,?,?,'Customer')");
    $s->bind_param("sss",$name,$email,$hash);
    if ($s->execute()) {
        // Welcome email
        sendEmail($email, $name, "Welcome to SAKSAAS!", "<div style='font-family:sans-serif;'><h2 style='color:#166534;'>Welcome, {$name}!</h2><p>Your SAKSAAS account has been created successfully. Start exploring our handcrafted collection!</p><a href='" . SITE_URL . "' style='background:#166534;color:#fff;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:bold;'>Shop Now</a></div>");
        echo json_encode(["success"=>true,"message"=>"Account created successfully"]);
    } else { http_response_code(500); echo json_encode(["success"=>false,"message"=>"Failed to create account"]); }
    $s->close();
}

// ============================================================================
//  PROFILE
// ============================================================================
function handleGetProfile($conn, $data) {
    $email = trim($data['email'] ?? '');
    if (!$email) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Email required"]); return; }
    $u = getUserByEmail($conn, $email);
    if (!$u) { http_response_code(404); echo json_encode(["success"=>false,"message"=>"User not found"]); return; }
    echo json_encode(["success"=>true,"user"=>formatUser($u)]);
}
function handleUpdateProfile($conn, $data) {
    $email=$data['email']??''; $name=$data['fullName']??''; $phone=$data['phone']??'';
    $addr=$data['addressLine1']??''; $city=$data['city']??''; $pin=$data['pincode']??'';
    if (!$email) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Email required"]); return; }
    $s=$conn->prepare("UPDATE Users SET FullName=?,Phone=?,AddressLine1=?,City=?,Pincode=? WHERE Email=?");
    $s->bind_param("ssssss",$name,$phone,$addr,$city,$pin,$email);
    if ($s->execute()) { echo json_encode(["success"=>true,"message"=>"Profile updated"]); } else { http_response_code(500); echo json_encode(["success"=>false,"message"=>"Update failed"]); }
    $s->close();
}
function handleUploadImage($conn) {
    $email = trim($_POST['email'] ?? '');
    if (!$email) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Email required"]); return; }
    // Delete old image file
    $u = getUserByEmail($conn, $email);
    if ($u && $u['ProfileImage']) {
        $oldFile = __DIR__ . '/..' . $u['ProfileImage'];
        if (file_exists($oldFile)) @unlink($oldFile);
    }
    $url = saveFile('image', 'profiles', 'profile_' . md5($email));
    if (!$url) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Invalid image (JPEG/PNG/WEBP only)"]); return; }
    $s=$conn->prepare("UPDATE Users SET ProfileImage=? WHERE Email=?"); $s->bind_param("ss",$url,$email);
    if ($s->execute()) { echo json_encode(["success"=>true,"imageUrl"=>$url,"message"=>"Image updated"]); } else { http_response_code(500); echo json_encode(["success"=>false,"message"=>"DB error"]); }
    $s->close();
}
function handleChangePassword($conn, $data) {
    $email=$data['email']??''; $cur=$data['currentPassword']??''; $new=$data['newPassword']??'';
    if (!$email||!$cur||!$new) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"All fields required"]); return; }
    if (strlen($new)<6) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"New password min 6 chars"]); return; }
    $u = getUserByEmail($conn,$email);
    if (!$u) { http_response_code(404); echo json_encode(["success"=>false,"message"=>"User not found"]); return; }
    if (!password_verify($cur,$u['PasswordHash'])) { http_response_code(401); echo json_encode(["success"=>false,"message"=>"Current password incorrect"]); return; }
    $hash=password_hash($new,PASSWORD_BCRYPT);
    $s=$conn->prepare("UPDATE Users SET PasswordHash=? WHERE Email=?"); $s->bind_param("ss",$hash,$email);
    if ($s->execute()) { echo json_encode(["success"=>true,"message"=>"Password changed"]); } else { http_response_code(500); echo json_encode(["success"=>false,"message"=>"Failed"]); }
    $s->close();
}

// ============================================================================
//  CONTACT EMAIL
// ============================================================================
function handleSendContactEmail($data) {
    $name    = htmlspecialchars(trim($data['name']    ?? ''));
    $email   = trim($data['email']   ?? '');
    $subject = htmlspecialchars(trim($data['subject'] ?? 'Contact Form Message'));
    $message = htmlspecialchars(trim($data['message'] ?? ''));

    if (!$name || !$email || !$message) {
        http_response_code(400);
        echo json_encode(["success"=>false,"message"=>"Name, email and message are required"]);
        return;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["success"=>false,"message"=>"Invalid email address"]);
        return;
    }

    // ── Email to admin: shows user name, email, subject, message ─────────
    // Reply-To is set to user's email — so when YOU hit Reply in Gmail,
    // it goes directly to the person who filled the form.
    $adminBody = "
    <div style='font-family:sans-serif;max-width:600px;margin:0 auto;'>
      <div style='background:#166534;padding:20px 32px;'>
        <h1 style='color:#fff;margin:0;font-size:20px;letter-spacing:3px;'>SAKSAAS</h1>
        <p style='color:#dcfce7;margin:4px 0 0;font-size:12px;'>New Contact Form Message</p>
      </div>
      <div style='padding:28px 32px;'>
        <table style='width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;'>
          <tr>
            <td style='padding:12px 16px;font-weight:bold;color:#374151;width:90px;background:#f9fafb;border-bottom:1px solid #e5e7eb;'>From</td>
            <td style='padding:12px 16px;color:#166534;font-weight:bold;border-bottom:1px solid #e5e7eb;'>{$name}</td>
          </tr>
          <tr>
            <td style='padding:12px 16px;font-weight:bold;color:#374151;background:#f9fafb;border-bottom:1px solid #e5e7eb;'>Email</td>
            <td style='padding:12px 16px;border-bottom:1px solid #e5e7eb;'>
              <a href='mailto:{$email}' style='color:#166534;text-decoration:none;'>{$email}</a>
            </td>
          </tr>
          <tr>
            <td style='padding:12px 16px;font-weight:bold;color:#374151;background:#f9fafb;border-bottom:1px solid #e5e7eb;'>Subject</td>
            <td style='padding:12px 16px;color:#374151;border-bottom:1px solid #e5e7eb;'>{$subject}</td>
          </tr>
          <tr>
            <td style='padding:12px 16px;font-weight:bold;color:#374151;background:#f9fafb;vertical-align:top;'>Message</td>
            <td style='padding:12px 16px;color:#374151;line-height:1.7;'>{$message}</td>
          </tr>
        </table>
        <div style='margin-top:20px;padding:14px 16px;background:#f0fdf4;border-left:4px solid #166534;border-radius:4px;'>
          <p style='margin:0;color:#166534;font-size:13px;'>
            Hit <strong>Reply</strong> in your email client to respond directly to {$name} at {$email}
          </p>
        </div>
      </div>
    </div>";

    // ── Auto-reply to user: confirms we received their message ────────────
    $shortMsg = substr($message, 0, 250) . (strlen($message) > 250 ? '...' : '');
    $confirmBody = "
    <div style='font-family:sans-serif;max-width:600px;margin:0 auto;'>
      <div style='background:#166534;padding:24px 32px;text-align:center;'>
        <h1 style='color:#fff;margin:0;font-size:24px;letter-spacing:4px;'>SAKSAAS</h1>
        <p style='color:#dcfce7;margin:6px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;'>Artisan Jewellery</p>
      </div>
      <div style='padding:32px;'>
        <h2 style='color:#374151;margin:0 0 16px;'>Hi {$name}, we got your message!</h2>
        <p style='color:#6b7280;line-height:1.7;margin:0 0 20px;'>
          Thank you for contacting SAKSAAS. Our team will reply to you within 24 hours.
        </p>
        <div style='background:#f0fdf4;padding:20px;border-radius:8px;border-left:4px solid #166534;margin-bottom:20px;'>
          <p style='color:#374151;font-size:13px;font-weight:bold;margin:0 0 8px;'>Your message:</p>
          <p style='color:#6b7280;font-size:13px;line-height:1.6;margin:0;font-style:italic;'>&ldquo;{$shortMsg}&rdquo;</p>
        </div>
        <p style='color:#9ca3af;font-size:13px;margin:0;'>
          Urgent? Email us: <a href='mailto:hello@saksaas.com' style='color:#166534;'>hello@saksaas.com</a>
          &nbsp;|&nbsp; WhatsApp: +91 98765 43210
        </p>
      </div>
      <div style='background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;'>
        <p style='color:#9ca3af;font-size:11px;margin:0;'>
          SAKSAAS Artisan Jewellery · 123 Artisan Lane, Bangalore, Karnataka 560001
        </p>
      </div>
    </div>";

    // Send email 1 to admin with Reply-To = user email
    $sent1 = sendEmail(
        ADMIN_EMAIL,
        FROM_NAME,
        "[SAKSAAS Contact] {$subject} — from {$name}",
        $adminBody,
        $email
    );

    // Send email 2 auto-confirmation to the user
    $sent2 = sendEmail(
        $email,
        $name,
        "We received your message — " . SITE_NAME,
        $confirmBody
    );

    // Always return success — UI shows confirmation regardless
    echo json_encode([
        "success"   => true,
        "message"   => "Message received! We will reply to {$email} within 24 hours.",
        "emailSent" => ($sent1 || $sent2)
    ]);
}


// ============================================================================
//  CATEGORIES
// ============================================================================
function handleGetCategories($conn) {
    $s=$conn->prepare("SELECT CategoryID AS id,CategoryName AS name FROM Categories ORDER BY CategoryName");
    $s->execute(); $cats=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    foreach($cats as &$cat) {
        $s=$conn->prepare("SELECT SubCategoryID AS id,SubCategoryName AS name FROM SubCategories WHERE CategoryID=? ORDER BY SubCategoryName");
        $s->bind_param("i",$cat['id']); $s->execute();
        $cat['subCategories']=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    }
    echo json_encode(["success"=>true,"categories"=>$cats]);
}

// ============================================================================
//  PRODUCTS
// ============================================================================
function handleGetProducts($conn) {
    $where=["1=1"]; $params=[]; $types="";
    if (!empty($_GET['category'])) { $where[]="c.CategoryName=?"; $params[]=$_GET['category']; $types.="s"; }
    if (!empty($_GET['sub']))      { $where[]="sc.SubCategoryName=?"; $params[]=$_GET['sub']; $types.="s"; }
    if (!empty($_GET['search']))   { $where[]="(p.Name LIKE ? OR p.Description LIKE ?)"; $q='%'.$_GET['search'].'%'; $params[]=$q; $params[]=$q; $types.="ss"; }
    if (!empty($_GET['under500']))   $where[]="p.IsUnder500=1";
    if (!empty($_GET['trending']))   $where[]="p.IsTrending=1";
    if (!empty($_GET['newArrival'])) $where[]="p.IsNewArrival=1";
    if (!empty($_GET['topSelling'])) $where[]="p.IsTopSelling=1";
    $ob="p.CreatedAt DESC";
    switch($_GET['sort']??'') { case 'price_asc': $ob="p.Price ASC"; break; case 'price_desc': $ob="p.Price DESC"; break; case 'trending': $ob="p.IsTrending DESC"; break; }
    $sql="SELECT p.ProductID AS id,p.Name AS name,p.Description AS description,p.Price AS price,
                 p.MainImageURL AS image,p.StockQuantity,(p.StockQuantity>0) AS inStock,
                 p.IsTrending AS trending,p.IsTopSelling AS topSelling,p.IsNewArrival AS newArrival,p.IsUnder500 AS under500,
                 c.CategoryName AS category,sc.SubCategoryName AS subCategory,p.CategoryID,p.SubCategoryID
          FROM Products p
          LEFT JOIN Categories c ON p.CategoryID=c.CategoryID
          LEFT JOIN SubCategories sc ON p.SubCategoryID=sc.SubCategoryID
          WHERE ".implode(" AND ",$where)." ORDER BY $ob";
    $s=$conn->prepare($sql);
    if ($types&&$params) $s->bind_param($types,...$params);
    $s->execute(); $rows=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    foreach($rows as &$row) {
        $pid=$row['id'];
        $s=$conn->prepare("SELECT ImageURL FROM ProductImages WHERE ProductID=? ORDER BY SortOrder"); $s->bind_param("i",$pid); $s->execute();
        $imgs=array_column($s->get_result()->fetch_all(MYSQLI_ASSOC),'ImageURL'); $s->close();
        $row['images']=$imgs?:[$row['image']];
        $s=$conn->prepare("SELECT SizeValue FROM ProductSizes WHERE ProductID=?"); $s->bind_param("i",$pid); $s->execute();
        $row['sizes']=array_column($s->get_result()->fetch_all(MYSQLI_ASSOC),'SizeValue'); $s->close();
        $row['trending']=(bool)$row['trending']; $row['topSelling']=(bool)$row['topSelling'];
        $row['newArrival']=(bool)$row['newArrival']; $row['under500']=(bool)$row['under500']; $row['inStock']=(bool)$row['inStock'];
    }
    echo json_encode(["success"=>true,"products"=>$rows]);
}
function handleGetProductById($conn) {
    $id=intval($_GET['id']??0);
    if (!$id) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"ID required"]); return; }
    $s=$conn->prepare("SELECT p.ProductID AS id,p.Name AS name,p.Description AS description,p.Price AS price,
                              p.MainImageURL AS image,p.StockQuantity,(p.StockQuantity>0) AS inStock,
                              p.IsTrending AS trending,p.IsTopSelling AS topSelling,p.IsNewArrival AS newArrival,p.IsUnder500 AS under500,
                              c.CategoryName AS category,sc.SubCategoryName AS subCategory
                       FROM Products p
                       LEFT JOIN Categories c ON p.CategoryID=c.CategoryID
                       LEFT JOIN SubCategories sc ON p.SubCategoryID=sc.SubCategoryID
                       WHERE p.ProductID=?");
    $s->bind_param("i",$id); $s->execute(); $row=$s->get_result()->fetch_assoc(); $s->close();
    if (!$row) { http_response_code(404); echo json_encode(["success"=>false,"message"=>"Not found"]); return; }
    $s=$conn->prepare("SELECT ImageID,ImageURL,SortOrder FROM ProductImages WHERE ProductID=? ORDER BY SortOrder");
    $s->bind_param("i",$id); $s->execute(); $row['galleryImages']=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    $row['images']=array_column($row['galleryImages'],'ImageURL')?:[$row['image']];
    $s=$conn->prepare("SELECT SizeValue FROM ProductSizes WHERE ProductID=?"); $s->bind_param("i",$id); $s->execute();
    $row['sizes']=array_column($s->get_result()->fetch_all(MYSQLI_ASSOC),'SizeValue'); $s->close();
    $row['trending']=(bool)$row['trending']; $row['topSelling']=(bool)$row['topSelling'];
    $row['newArrival']=(bool)$row['newArrival']; $row['under500']=(bool)$row['under500']; $row['inStock']=(bool)$row['inStock'];
    echo json_encode(["success"=>true,"product"=>$row]);
}

// ============================================================================
//  ORDERS
// ============================================================================
function handleCreateOrder($conn, $data) {
    $email=trim($data['email']??''); $items=$data['items']??[]; $total=floatval($data['totalAmount']??0);
    $method=trim($data['paymentMethod']??''); $addr=trim($data['shippingAddress']??'');
    if (!$email||empty($items)||!$total||!$addr) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Missing fields"]); return; }
    $u=getUserByEmail($conn,$email); if (!$u) { http_response_code(401); echo json_encode(["success"=>false,"message"=>"User not found"]); return; }
    $conn->begin_transaction();
    try {
        $s=$conn->prepare("INSERT INTO Orders(UserID,TotalAmount,PaymentMethod,ShippingAddress,Status) VALUES(?,?,?,?,'Processing')");
        $s->bind_param("idss",$u['UserID'],$total,$method,$addr); $s->execute(); $oid=$conn->insert_id; $s->close();
        foreach($items as $item) {
            $rawId = $item['productId'] ?? $item['id'] ?? 0;
            $pid   = is_numeric($rawId) ? intval($rawId) : 0;
            $pidOrNull = $pid > 0 ? $pid : null; // NULL for local products (string IDs like 'bang-0')
            $name  = $item['name']  ?? '';
            $img   = $item['imageURL'] ?? $item['image'] ?? '';
            $price = floatval($item['price'] ?? 0);
            $qty   = intval($item['quantity'] ?? $item['qty'] ?? 1);
            $size  = $item['selectedSize'] ?? $item['size'] ?? null;
            $s = $conn->prepare("INSERT INTO OrderItems(OrderID,ProductID,Quantity,UnitPrice,SelectedSize,Name,ImageURL) VALUES(?,?,?,?,?,?,?)");
            $s->bind_param("iiddsss", $oid, $pidOrNull, $qty, $price, $size, $name, $img);
            $s->execute(); $s->close();
            // Only update stock for real DB products
            if ($pidOrNull) {
                $st = $conn->prepare("UPDATE Products SET StockQuantity=GREATEST(StockQuantity-?,0) WHERE ProductID=?");
                $st->bind_param("ii", $qty, $pidOrNull); $st->execute(); $st->close();
            }
        }
        $s=$conn->prepare("INSERT INTO TrackingHistory(OrderID,Status,Description) VALUES(?,'Order Placed','Order placed and payment confirmed.')");
        $s->bind_param("i",$oid); $s->execute(); $s->close();
        createNotification($conn,$u['UserID'],"Order #{$oid} Placed!","Your order has been placed. Total: ₹".number_format($total,2),'order',"/order/{$oid}");
        $conn->commit();
        // Send confirmation email with invoice
        sendOrderConfirmationEmail($conn, $oid, $email, $u['FullName']);
        echo json_encode(["success"=>true,"orderId"=>$oid,"message"=>"Order placed successfully"]);
    } catch(Exception $e) { $conn->rollback(); http_response_code(500); echo json_encode(["success"=>false,"message"=>$e->getMessage()]); }
}
function handleGetOrders($conn, $data) {
    $email=trim($data['email']??''); $u=getUserByEmail($conn,$email);
    if (!$u) { http_response_code(401); echo json_encode(["success"=>false,"message"=>"Not found"]); return; }
    $s=$conn->prepare("SELECT OrderID,OrderDate,TotalAmount,Status,PaymentMethod,ShippingAddress,TrackingNumber FROM Orders WHERE UserID=? ORDER BY OrderDate DESC");
    $s->bind_param("i",$u['UserID']); $s->execute();
    echo json_encode(["success"=>true,"orders"=>$s->get_result()->fetch_all(MYSQLI_ASSOC)]); $s->close();
}
function handleGetOrderById($conn, $data) {
    $email=trim($data['email']??''); $oid=intval($data['orderId']??0);
    if (!$email||!$oid) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Required fields missing"]); return; }
    $u=getUserByEmail($conn,$email); if (!$u) { http_response_code(401); echo json_encode(["success"=>false,"message"=>"User not found"]); return; }
    $s=$conn->prepare("SELECT * FROM Orders WHERE OrderID=? AND UserID=?"); $s->bind_param("ii",$oid,$u['UserID']); $s->execute();
    $order=$s->get_result()->fetch_assoc(); $s->close();
    if (!$order) { http_response_code(404); echo json_encode(["success"=>false,"message"=>"Order not found"]); return; }
    $s=$conn->prepare("SELECT OrderItemID,ProductID,Quantity,UnitPrice AS Price,SelectedSize AS Size,Name,ImageURL FROM OrderItems WHERE OrderID=?");
    $s->bind_param("i",$oid); $s->execute(); $items=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    $s=$conn->prepare("SELECT Status,Location,Description,EventTime FROM TrackingHistory WHERE OrderID=? ORDER BY EventTime ASC");
    $s->bind_param("i",$oid); $s->execute(); $tracking=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    // Generate invoice HTML
    $invoiceHtml = generateInvoiceHTML($order, $items);
    echo json_encode(["success"=>true,"order"=>$order,"items"=>$items,"tracking"=>$tracking,"invoiceHtml"=>$invoiceHtml]);
}
function handleCancelOrder($conn, $data) {
    $email=trim($data['email']??''); $oid=intval($data['orderId']??0);
    if (!$email||!$oid) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Missing fields"]); return; }
    $u=getUserByEmail($conn,$email); if (!$u) { http_response_code(401); echo json_encode(["success"=>false,"message"=>"User not found"]); return; }
    $s=$conn->prepare("SELECT OrderID,Status FROM Orders WHERE OrderID=? AND UserID=?"); $s->bind_param("ii",$oid,$u['UserID']); $s->execute();
    $order=$s->get_result()->fetch_assoc(); $s->close();
    if (!$order) { http_response_code(404); echo json_encode(["success"=>false,"message"=>"Order not found"]); return; }
    if ($order['Status']!=='Processing') { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Cannot cancel — status: ".$order['Status']]); return; }
    $conn->begin_transaction();
    try {
        $s=$conn->prepare("UPDATE Orders SET Status='Cancelled' WHERE OrderID=?"); $s->bind_param("i",$oid); $s->execute(); $s->close();
        $s=$conn->prepare("SELECT ProductID,Quantity FROM OrderItems WHERE OrderID=? AND ProductID IS NOT NULL"); $s->bind_param("i",$oid); $s->execute();
        foreach($s->get_result()->fetch_all(MYSQLI_ASSOC) as $item) {
            $st=$conn->prepare("UPDATE Products SET StockQuantity=StockQuantity+? WHERE ProductID=?"); $st->bind_param("ii",$item['Quantity'],$item['ProductID']); $st->execute(); $st->close();
        }
        $s->close();
        $s=$conn->prepare("INSERT INTO TrackingHistory(OrderID,Status,Description) VALUES(?,'Cancelled','Order cancelled by customer.')"); $s->bind_param("i",$oid); $s->execute(); $s->close();
        createNotification($conn,$u['UserID'],"Order #{$oid} Cancelled","Your order has been cancelled. Refund (if prepaid) within 5-7 business days.",'order',"/order/{$oid}");
        $conn->commit();
        echo json_encode(["success"=>true,"message"=>"Order cancelled"]);
    } catch(Exception $e) { $conn->rollback(); http_response_code(500); echo json_encode(["success"=>false,"message"=>$e->getMessage()]); }
}

// ============================================================================
//  ORDER TRACKING
// ============================================================================
function handleGetTrackingByNumber($conn, $data) {
    $num=trim($data['orderNumber']??''); $email=trim($data['email']??'');
    if (!$num||!$email) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Order number and email required"]); return; }
    $nid=intval($num);
    $s=$conn->prepare("SELECT o.OrderID,o.Status,o.TrackingNumber,o.LastUpdateLocation,o.OrderDate,o.TotalAmount,o.ShippingAddress FROM Orders o JOIN Users u ON o.UserID=u.UserID WHERE (o.TrackingNumber=? OR o.OrderID=?) AND u.Email=?");
    $s->bind_param("sis",$num,$nid,$email); $s->execute(); $order=$s->get_result()->fetch_assoc(); $s->close();
    if (!$order) { http_response_code(404); echo json_encode(["success"=>false,"message"=>"No order found with that number and email"]); return; }
    $s=$conn->prepare("SELECT Status,Location,Description,EventTime FROM TrackingHistory WHERE OrderID=? ORDER BY EventTime ASC");
    $s->bind_param("i",$order['OrderID']); $s->execute(); $tracking=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    echo json_encode(["success"=>true,"order"=>$order,"tracking"=>$tracking,"estimatedDelivery"=>date('F d, Y',strtotime('+7 days',strtotime($order['OrderDate'])))]);
}

// ============================================================================
//  WISHLIST
// ============================================================================
function handleGetWishlist($conn, $data) {
    $u=getUserByEmail($conn,trim($data['email']??'')); if (!$u) { echo json_encode(["success"=>true,"wishlist"=>[]]); return; }
    $s=$conn->prepare("SELECT p.ProductID AS id,p.Name AS name,p.Price AS price,p.MainImageURL AS image,c.CategoryName AS category,(p.StockQuantity>0) AS inStock FROM Wishlist w JOIN Products p ON w.ProductID=p.ProductID LEFT JOIN Categories c ON p.CategoryID=c.CategoryID WHERE w.UserID=? ORDER BY w.AddedAt DESC");
    $s->bind_param("i",$u['UserID']); $s->execute();
    echo json_encode(["success"=>true,"wishlist"=>$s->get_result()->fetch_all(MYSQLI_ASSOC)]); $s->close();
}
function handleAddToWishlist($conn, $data) {
    $u=getUserByEmail($conn,trim($data['email']??'')); $pid=intval($data['productId']??0);
    if (!$u||!$pid) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Invalid"]); return; }
    $s=$conn->prepare("INSERT IGNORE INTO Wishlist(UserID,ProductID) VALUES(?,?)"); $s->bind_param("ii",$u['UserID'],$pid); $s->execute(); $s->close();
    echo json_encode(["success"=>true,"message"=>"Added to wishlist"]);
}
function handleRemoveFromWishlist($conn, $data) {
    $u=getUserByEmail($conn,trim($data['email']??'')); $pid=intval($data['productId']??0);
    if (!$u||!$pid) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Invalid"]); return; }
    $s=$conn->prepare("DELETE FROM Wishlist WHERE UserID=? AND ProductID=?"); $s->bind_param("ii",$u['UserID'],$pid); $s->execute(); $s->close();
    echo json_encode(["success"=>true,"message"=>"Removed from wishlist"]);
}

// ============================================================================
//  NOTIFICATIONS
// ============================================================================
function handleGetNotifications($conn, $data) {
    $u=getUserByEmail($conn,trim($data['email']??'')); if (!$u) { echo json_encode(["success"=>true,"notifications"=>[],"unreadCount"=>0]); return; }
    $s=$conn->prepare("SELECT NotificationID,Title,Message,Type,IsRead,LinkURL,CreatedAt FROM Notifications WHERE UserID=? ORDER BY CreatedAt DESC LIMIT 30");
    $s->bind_param("i",$u['UserID']); $s->execute(); $rows=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    echo json_encode(["success"=>true,"notifications"=>$rows,"unreadCount"=>count(array_filter($rows,fn($r)=>!$r['IsRead']))]);
}
function handleMarkNotificationRead($conn, $data) {
    $u=getUserByEmail($conn,trim($data['email']??'')); $nid=intval($data['notificationId']??0);
    if (!$u||!$nid) return;
    $s=$conn->prepare("UPDATE Notifications SET IsRead=1 WHERE NotificationID=? AND UserID=?"); $s->bind_param("ii",$nid,$u['UserID']); $s->execute(); $s->close();
    echo json_encode(["success"=>true]);
}
function handleMarkAllRead($conn, $data) {
    $u=getUserByEmail($conn,trim($data['email']??'')); if (!$u) return;
    $s=$conn->prepare("UPDATE Notifications SET IsRead=1 WHERE UserID=?"); $s->bind_param("i",$u['UserID']); $s->execute(); $s->close();
    echo json_encode(["success"=>true]);
}

// ============================================================================
//  CUSTOM REQUESTS
// ============================================================================
function handleSubmitCustomRequest($conn) {
    $email=trim($_POST['email']??''); $occ=trim($_POST['occasion']??''); $budget=trim($_POST['budgetRange']??''); $pref=trim($_POST['preferences']??'');
    if (!$email||!$occ) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Email and occasion required"]); return; }
    $u=getUserByEmail($conn,$email); if (!$u) { http_response_code(401); echo json_encode(["success"=>false,"message"=>"User not found"]); return; }
    $imgUrl=saveFile('outfitImage','custom_requests','outfit');
    $s=$conn->prepare("INSERT INTO CustomRequests(UserID,OutfitImageURL,Occasion,BudgetRange,Preferences) VALUES(?,?,?,?,?)");
    $s->bind_param("issss",$u['UserID'],$imgUrl,$occ,$budget,$pref);
    if ($s->execute()) {
        $rid=$conn->insert_id; $s->close();
        createNotification($conn,$u['UserID'],"Custom Request #{$rid} Received!","Our team will contact you within 24 hours.",'custom_request',"/account");
        // Notify admin
        sendEmail(ADMIN_EMAIL, FROM_NAME, "[Custom Request #{$rid}] from ".$u['FullName'],
            "<p><strong>From:</strong> ".$u['FullName']." (".$email.")</p><p><strong>Occasion:</strong> {$occ}</p><p><strong>Budget:</strong> {$budget}</p><p><strong>Details:</strong> {$pref}</p>");
        echo json_encode(["success"=>true,"requestId"=>$rid,"message"=>"Request submitted successfully"]);
    } else { $s->close(); http_response_code(500); echo json_encode(["success"=>false,"message"=>"Failed to submit"]); }
}
function handleGetMyCustomRequests($conn, $data) {
    $u=getUserByEmail($conn,trim($data['email']??'')); if (!$u) { http_response_code(401); echo json_encode(["success"=>false,"message"=>"Not logged in"]); return; }
    $s=$conn->prepare("SELECT * FROM CustomRequests WHERE UserID=? ORDER BY CreatedAt DESC"); $s->bind_param("i",$u['UserID']); $s->execute();
    echo json_encode(["success"=>true,"requests"=>$s->get_result()->fetch_all(MYSQLI_ASSOC)]); $s->close();
}

// ============================================================================
//  PAYMENT — MOCK MODE (no real Razorpay API call)
//  To go live: add HMAC verification to handleVerifyPayment and
//  replace the curl mock in handleCreateRazorpayOrder with real API call.
// ============================================================================

/**
 * Step 1 — Create order in DB, return a mock Razorpay order ID.
 * Frontend calls this before showing the "payment processing" state.
 */
function handleCreateRazorpayOrder($conn, $data) {
    $email  = trim($data['email']  ?? '');
    $amount = floatval($data['amount'] ?? 0);
    $addr   = trim($data['shippingAddress'] ?? '');
    $items  = $data['items']  ?? [];
    $method = trim($data['paymentMethod'] ?? 'card');

    if (!$email || !$amount || empty($items) || !$addr) {
        http_response_code(400);
        echo json_encode(["success"=>false,"message"=>"Missing required fields"]);
        return;
    }
    $u = getUserByEmail($conn, $email);
    if (!$u) {
        http_response_code(401);
        echo json_encode(["success"=>false,"message"=>"User not found — please log in again"]);
        return;
    }

    $conn->begin_transaction();
    try {
        // Save PENDING order
        $s = $conn->prepare("INSERT INTO Orders(UserID,TotalAmount,PaymentMethod,ShippingAddress,Status) VALUES(?,?,?,?,'Pending')");
        $s->bind_param("idss", $u['UserID'], $amount, $method, $addr);
        $s->execute();
        $oid = $conn->insert_id;
        $s->close();

        // Save order items (NULL for local products whose IDs are strings like 'bang-0')
        foreach ($items as $item) {
            $rawId = $item['productId'] ?? $item['id'] ?? 0;
            $pid   = is_numeric($rawId) ? intval($rawId) : 0;
            $pidOrNull = $pid > 0 ? $pid : null;
            $name  = $item['name']  ?? '';
            $img   = $item['imageURL'] ?? $item['image'] ?? '';
            $price = floatval($item['price'] ?? 0);
            $qty   = intval($item['quantity'] ?? $item['qty'] ?? 1);
            $size  = $item['selectedSize'] ?? $item['size'] ?? null;
            $s = $conn->prepare("INSERT INTO OrderItems(OrderID,ProductID,Quantity,UnitPrice,SelectedSize,Name,ImageURL) VALUES(?,?,?,?,?,?,?)");
            $s->bind_param("iiddsss", $oid, $pidOrNull, $qty, $price, $size, $name, $img);
            $s->execute(); $s->close();
        }

        // Generate mock order ID (no real Razorpay call)
        $mockId = "order_mock_" . uniqid();
        $s = $conn->prepare("UPDATE Orders SET TrackingNumber=? WHERE OrderID=?");
        $s->bind_param("si", $mockId, $oid); $s->execute(); $s->close();
        $conn->commit();

        echo json_encode([
            "success"         => true,
            "razorpayOrderId" => $mockId,
            "internalOrderId" => $oid,
            "amount"          => intval(round($amount * 100))
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["success"=>false,"message"=>"Order creation failed: " . $e->getMessage()]);
    }
}

/**
 * Step 2 — Confirm the order after simulated payment.
 * Skips HMAC signature check (mock mode).
 * Returns invoiceHtml so frontend can show receipt immediately.
 */
function handleVerifyPayment($conn, $data) {
    $email = trim($data['email'] ?? '');
    $oid   = intval($data['internalOrderId'] ?? 0);

    if (!$email || !$oid) {
        http_response_code(400);
        echo json_encode(["success"=>false,"message"=>"email and internalOrderId required"]);
        return;
    }

    $paymentId = trim($data['razorpay_payment_id'] ?? '') ?: ("mock_pay_" . uniqid());

    $conn->begin_transaction();
    try {
        // 1. Mark order Processing
        $s = $conn->prepare("UPDATE Orders SET Status='Processing', TrackingNumber=? WHERE OrderID=?");
        $s->bind_param("si", $paymentId, $oid); $s->execute(); $s->close();

        // 2. Tracking history
        $s = $conn->prepare("INSERT INTO TrackingHistory(OrderID,Status,Description) VALUES(?,'Order Placed','Payment confirmed. Your order is being prepared.')");
        $s->bind_param("i", $oid); $s->execute(); $s->close();

        // 3. Deduct stock
        $s = $conn->prepare("SELECT ProductID, Quantity FROM OrderItems WHERE OrderID=? AND ProductID IS NOT NULL");
        $s->bind_param("i", $oid); $s->execute();
        $orderItems = $s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
        foreach ($orderItems as $item) {
            $st = $conn->prepare("UPDATE Products SET StockQuantity=GREATEST(StockQuantity-?,0) WHERE ProductID=?");
            $st->bind_param("ii", $item['Quantity'], $item['ProductID']); $st->execute(); $st->close();
        }

        // 4. Notify + email invoice
        $u = getUserByEmail($conn, $email);
        if ($u) {
            createNotification($conn, $u['UserID'],
                "Order #{$oid} Confirmed!",
                "Payment successful! Your order is being prepared.",
                'order', "/order/{$oid}");
            sendOrderConfirmationEmail($conn, $oid, $email, $u['FullName']);
        }

        $conn->commit();

        // 5. Fetch order + items to build invoice HTML for frontend
        $s = $conn->prepare("SELECT * FROM Orders WHERE OrderID=?");
        $s->bind_param("i", $oid); $s->execute();
        $order = $s->get_result()->fetch_assoc(); $s->close();

        $s = $conn->prepare("SELECT * FROM OrderItems WHERE OrderID=?");
        $s->bind_param("i", $oid); $s->execute();
        $items = $s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();

        echo json_encode([
            "success"     => true,
            "orderId"     => $oid,
            "message"     => "Order placed successfully!",
            "invoiceHtml" => generateInvoiceHTML($order, $items)
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["success"=>false,"message"=>"Confirmation failed: " . $e->getMessage()]);
    }
}

// ============================================================================
//  ADMIN
// ============================================================================
function adminGetDashboardStats($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $r=$conn->query("SELECT COUNT(*) AS total,IFNULL(SUM(TotalAmount),0) AS revenue FROM Orders WHERE Status!='Pending'"); $ord=$r->fetch_assoc();
    $r=$conn->query("SELECT COUNT(*) AS total FROM Users WHERE Role='Customer'"); $usr=$r->fetch_assoc();
    $r=$conn->query("SELECT COUNT(*) AS total FROM Products"); $prod=$r->fetch_assoc();
    $r=$conn->query("SELECT COUNT(*) AS total FROM Orders WHERE Status='Processing'"); $pend=$r->fetch_assoc();
    $r=$conn->query("SELECT COUNT(*) AS total FROM CustomRequests WHERE Status='Pending'"); $cr=$r->fetch_assoc();
    $s=$conn->prepare("SELECT o.OrderID,u.FullName,o.TotalAmount,o.Status,o.OrderDate FROM Orders o JOIN Users u ON o.UserID=u.UserID WHERE o.Status!='Pending' ORDER BY o.OrderDate DESC LIMIT 5");
    $s->execute(); $recent=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    echo json_encode(["success"=>true,"stats"=>["totalOrders"=>(int)$ord['total'],"totalRevenue"=>(float)$ord['revenue'],"totalUsers"=>(int)$usr['total'],"totalProducts"=>(int)$prod['total'],"pendingOrders"=>(int)$pend['total'],"pendingCustomRequests"=>(int)$cr['total'],"recentOrders"=>$recent]]);
}
function adminGetAllOrders($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $s=$conn->prepare("SELECT o.OrderID,u.FullName,u.Email,o.TotalAmount,o.Status,o.PaymentMethod,o.ShippingAddress,o.OrderDate,o.TrackingNumber FROM Orders o JOIN Users u ON o.UserID=u.UserID WHERE o.Status!='Pending' ORDER BY o.OrderDate DESC");
    $s->execute(); echo json_encode(["success"=>true,"orders"=>$s->get_result()->fetch_all(MYSQLI_ASSOC)]); $s->close();
}
function adminUpdateOrderStatus($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $oid=intval($data['orderId']??0); $status=trim($data['status']??'');
    $loc=trim($data['location']??''); $tn=trim($data['trackingNumber']??'');
    $allowed=['Processing','Shipped','Out for Delivery','Delivered','Cancelled'];
    if (!$oid||!in_array($status,$allowed)) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Invalid params"]); return; }
    $s=$conn->prepare("UPDATE Orders SET Status=?,LastUpdateLocation=?,TrackingNumber=IF(?!='',?,TrackingNumber) WHERE OrderID=?");
    $s->bind_param("ssssi",$status,$loc,$tn,$tn,$oid); $s->execute(); $s->close();
    $desc="Order status: {$status}".($loc?" · {$loc}":'');
    $s=$conn->prepare("INSERT INTO TrackingHistory(OrderID,Status,Location,Description) VALUES(?,?,?,?)");
    $s->bind_param("isss",$oid,$status,$loc,$desc); $s->execute(); $s->close();
    $s=$conn->prepare("SELECT UserID FROM Orders WHERE OrderID=?"); $s->bind_param("i",$oid); $s->execute();
    $row=$s->get_result()->fetch_assoc(); $s->close();
    if ($row) createNotification($conn,$row['UserID'],"Order #{$oid} — {$status}",$desc,'order',"/order/{$oid}");
    echo json_encode(["success"=>true,"message"=>"Status updated to {$status}"]);
}
function adminGetAllUsers($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $s=$conn->prepare("SELECT UserID,FullName,Email,Role,Phone,City,CreatedAt FROM Users ORDER BY CreatedAt DESC");
    $s->execute(); echo json_encode(["success"=>true,"users"=>$s->get_result()->fetch_all(MYSQLI_ASSOC)]); $s->close();
}
function adminAddProduct($conn) {
    $email=trim($_POST['email']??''); if (!requireAdmin($conn,$email)) return;
    $name=trim($_POST['name']??''); $desc=trim($_POST['description']??''); $price=floatval($_POST['price']??0);
    $catId=intval($_POST['categoryId']??0); $subId=intval($_POST['subCategoryId']??0)?:null;
    $stock=intval($_POST['stockQty']??0); $trend=intval($_POST['isTrending']??0);
    $top=intval($_POST['isTopSelling']??0); $newArr=intval($_POST['isNewArrival']??0); $u500=intval($_POST['isUnder500']??0);
    $sizes=trim($_POST['sizes']??'');
    if (!$name||!$price||!$catId) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"name, price, categoryId required"]); return; }
    $mainImg=saveFile('image','products','prod');
    if (!$mainImg) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Main image required"]); return; }
    $conn->begin_transaction();
    try {
        $s=$conn->prepare("INSERT INTO Products(CategoryID,SubCategoryID,Name,Description,Price,MainImageURL,StockQuantity,IsTrending,IsTopSelling,IsNewArrival,IsUnder500) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
        $s->bind_param("iissdsiiiii",$catId,$subId,$name,$desc,$price,$mainImg,$stock,$trend,$top,$newArr,$u500);
        $s->execute(); $pid=$conn->insert_id; $s->close();
        if (!empty($_FILES['extraImages']['name'][0])) {
            foreach($_FILES['extraImages']['name'] as $i=>$fn) {
                $tmp=$_FILES['extraImages']['tmp_name'][$i]; $type=$_FILES['extraImages']['type'][$i];
                $allowed=['image/jpeg','image/jpg','image/png','image/webp','image/gif'];
                if (in_array($type,$allowed)&&is_uploaded_file($tmp)) {
                    $ext=strtolower(pathinfo($fn,PATHINFO_EXTENSION));
                    $dir=UPLOAD_PATH.'products/'; if(!is_dir($dir)) mkdir($dir,0755,true);
                    $fname='gallery_'.$pid.'_'.$i.'.'.$ext; $dest=$dir.$fname;
                    if (move_uploaded_file($tmp,$dest)) { $url=UPLOAD_URL.'products/'.$fname; $s=$conn->prepare("INSERT INTO ProductImages(ProductID,ImageURL,SortOrder) VALUES(?,?,?)"); $s->bind_param("isi",$pid,$url,$i); $s->execute(); $s->close(); }
                }
            }
        }
        if ($sizes) foreach(explode(',',$sizes) as $sv) { $sv=trim($sv); if($sv){$s=$conn->prepare("INSERT INTO ProductSizes(ProductID,SizeValue) VALUES(?,?)"); $s->bind_param("is",$pid,$sv); $s->execute(); $s->close();} }
        $conn->commit();
        echo json_encode(["success"=>true,"productId"=>$pid,"message"=>"Product added"]);
    } catch(Exception $e) { $conn->rollback(); http_response_code(500); echo json_encode(["success"=>false,"message"=>$e->getMessage()]); }
}
function adminUpdateProduct($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $pid=intval($data['productId']??0); $name=trim($data['name']??''); $desc=trim($data['description']??'');
    $price=floatval($data['price']??0); $catId=intval($data['categoryId']??0); $subId=intval($data['subCategoryId']??0)?:null;
    $stock=intval($data['stockQty']??0); $trend=intval($data['isTrending']??0); $top=intval($data['isTopSelling']??0);
    $newArr=intval($data['isNewArrival']??0); $u500=intval($data['isUnder500']??0);
    if (!$pid||!$name||!$price||!$catId) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Missing required fields"]); return; }
    $s=$conn->prepare("UPDATE Products SET Name=?,Description=?,Price=?,CategoryID=?,SubCategoryID=?,StockQuantity=?,IsTrending=?,IsTopSelling=?,IsNewArrival=?,IsUnder500=? WHERE ProductID=?");
    $s->bind_param("ssdiiiiiiii",$name,$desc,$price,$catId,$subId,$stock,$trend,$top,$newArr,$u500,$pid);
    if ($s->execute()) { echo json_encode(["success"=>true,"message"=>"Product updated"]); } else { http_response_code(500); echo json_encode(["success"=>false,"message"=>"Update failed: ".$s->error]); }
    $s->close();
}
function adminUpdateProductImage($conn) {
    $email=trim($_POST['email']??''); if (!requireAdmin($conn,$email)) return;
    $pid=intval($_POST['productId']??0); $type=trim($_POST['type']??'main'); // 'main' or 'gallery'
    if (!$pid) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"productId required"]); return; }
    $url=saveFile('image','products','prod');
    if (!$url) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Invalid image"]); return; }
    if ($type === 'main') {
        // Delete old main image
        $s=$conn->prepare("SELECT MainImageURL FROM Products WHERE ProductID=?"); $s->bind_param("i",$pid); $s->execute();
        $row=$s->get_result()->fetch_assoc(); $s->close();
        if ($row && $row['MainImageURL']) { $old=__DIR__.'/..'.$row['MainImageURL']; if(file_exists($old)) @unlink($old); }
        $s=$conn->prepare("UPDATE Products SET MainImageURL=? WHERE ProductID=?"); $s->bind_param("si",$url,$pid); $s->execute(); $s->close();
        echo json_encode(["success"=>true,"imageUrl"=>$url,"message"=>"Main image updated"]);
    } else {
        // Add as gallery image
        $sort=intval($_POST['sortOrder']??0);
        $s=$conn->prepare("INSERT INTO ProductImages(ProductID,ImageURL,SortOrder) VALUES(?,?,?)"); $s->bind_param("isi",$pid,$url,$sort); $s->execute(); $iid=$conn->insert_id; $s->close();
        echo json_encode(["success"=>true,"imageId"=>$iid,"imageUrl"=>$url,"message"=>"Gallery image added"]);
    }
}
function adminDeleteProductImage($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $iid=intval($data['imageId']??0);
    if (!$iid) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"imageId required"]); return; }
    $s=$conn->prepare("SELECT ImageURL FROM ProductImages WHERE ImageID=?"); $s->bind_param("i",$iid); $s->execute();
    $row=$s->get_result()->fetch_assoc(); $s->close();
    if ($row) { $f=__DIR__.'/..'.$row['ImageURL']; if(file_exists($f)) @unlink($f); }
    $s=$conn->prepare("DELETE FROM ProductImages WHERE ImageID=?"); $s->bind_param("i",$iid); $s->execute(); $s->close();
    echo json_encode(["success"=>true,"message"=>"Image deleted"]);
}
function adminDeleteProduct($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $pid=intval($data['productId']??0); if (!$pid) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"productId required"]); return; }
    // Delete image files
    $s=$conn->prepare("SELECT MainImageURL FROM Products WHERE ProductID=?"); $s->bind_param("i",$pid); $s->execute();
    $row=$s->get_result()->fetch_assoc(); $s->close();
    if ($row&&$row['MainImageURL']) { $f=__DIR__.'/..'.$row['MainImageURL']; if(file_exists($f)) @unlink($f); }
    $s=$conn->prepare("SELECT ImageURL FROM ProductImages WHERE ProductID=?"); $s->bind_param("i",$pid); $s->execute();
    foreach($s->get_result()->fetch_all(MYSQLI_ASSOC) as $img) { $f=__DIR__.'/..'.$img['ImageURL']; if(file_exists($f)) @unlink($f); }
    $s->close();
    $s=$conn->prepare("DELETE FROM Products WHERE ProductID=?"); $s->bind_param("i",$pid);
    if ($s->execute()) { echo json_encode(["success"=>true,"message"=>"Product deleted"]); } else { http_response_code(500); echo json_encode(["success"=>false,"message"=>"Delete failed"]); }
    $s->close();
}
function adminGetProductById($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $pid=intval($data['productId']??0); if (!$pid) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"productId required"]); return; }
    $s=$conn->prepare("SELECT p.*,c.CategoryName AS category,sc.SubCategoryName AS subCategory,(p.StockQuantity>0) AS inStock FROM Products p LEFT JOIN Categories c ON p.CategoryID=c.CategoryID LEFT JOIN SubCategories sc ON p.SubCategoryID=sc.SubCategoryID WHERE p.ProductID=?");
    $s->bind_param("i",$pid); $s->execute(); $row=$s->get_result()->fetch_assoc(); $s->close();
    if (!$row) { http_response_code(404); echo json_encode(["success"=>false,"message"=>"Not found"]); return; }
    $s=$conn->prepare("SELECT ImageID,ImageURL,SortOrder FROM ProductImages WHERE ProductID=? ORDER BY SortOrder"); $s->bind_param("i",$pid); $s->execute();
    $row['galleryImages']=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    $s=$conn->prepare("SELECT SizeID,SizeValue FROM ProductSizes WHERE ProductID=?"); $s->bind_param("i",$pid); $s->execute();
    $row['sizeList']=$s->get_result()->fetch_all(MYSQLI_ASSOC); $s->close();
    $row['images']=array_column($row['galleryImages'],'ImageURL')?:[$row['MainImageURL']];
    $row['sizes']=array_column($row['sizeList'],'SizeValue');
    $row['id']=$row['ProductID']; $row['name']=$row['Name']; $row['price']=(float)$row['Price'];
    $row['inStock']=(bool)$row['inStock'];
    echo json_encode(["success"=>true,"product"=>$row]);
}
function adminGetCustomRequests($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $s=$conn->prepare("SELECT cr.*,u.FullName,u.Email FROM CustomRequests cr LEFT JOIN Users u ON cr.UserID=u.UserID ORDER BY cr.CreatedAt DESC");
    $s->execute(); echo json_encode(["success"=>true,"requests"=>$s->get_result()->fetch_all(MYSQLI_ASSOC)]); $s->close();
}
function adminUpdateCustomRequestStatus($conn, $data) {
    if (!requireAdmin($conn,$data['email']??'')) return;
    $rid=intval($data['requestId']??0); $status=trim($data['status']??''); $notes=trim($data['adminNotes']??'');
    $allowed=['Pending','In Review','Quote Sent','Confirmed','Rejected'];
    if (!$rid||!in_array($status,$allowed)) { http_response_code(400); echo json_encode(["success"=>false,"message"=>"Invalid params"]); return; }
    $s=$conn->prepare("UPDATE CustomRequests SET Status=?,AdminNotes=? WHERE RequestID=?"); $s->bind_param("ssi",$status,$notes,$rid); $s->execute(); $s->close();
    $s=$conn->prepare("SELECT UserID,Occasion FROM CustomRequests WHERE RequestID=?"); $s->bind_param("i",$rid); $s->execute();
    $cr=$s->get_result()->fetch_assoc(); $s->close();
    if ($cr) createNotification($conn,$cr['UserID'],"Custom Request Update","Your request for '{$cr['Occasion']}' is now: {$status}",'custom_request',"/account");
    echo json_encode(["success"=>true,"message"=>"Status updated to {$status}"]);
}
?>