const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const logger = functions.logger;

const SERVICE_PREFIX = {
  Consultation: "D",
  Pharmacy: "P"
};

function requireAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }
}

function normalizeServiceType(serviceType) {
  if (!SERVICE_PREFIX[serviceType]) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid service type.");
  }
  return serviceType;
}

function normalizeString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new functions.https.HttpsError("invalid-argument", `${fieldName} is required.`);
  }
  return value.trim();
}

exports.createTicket = functions.https.onCall(async (data) => {
  const name = normalizeString(data.name, "name");
  const phone = normalizeString(data.phone, "phone");
  const date = normalizeString(data.date, "date");
  const time = normalizeString(data.time, "time");
  const serviceType = normalizeServiceType(data.serviceType);
  const prefix = SERVICE_PREFIX[serviceType];

  const result = await db.runTransaction(async (transaction) => {
    const counterRef = db.collection("counters").doc(serviceType);
    const counterSnap = await transaction.get(counterRef);
    const currentValue = counterSnap.exists ? counterSnap.data().value || 0 : 0;
    const nextValue = currentValue + 1;
    const ticketNumber = `${prefix}-${String(nextValue).padStart(3, "0")}`;
    const ticketRef = db.collection("appointments").doc();

    transaction.set(counterRef, { value: nextValue }, { merge: true });
    transaction.set(ticketRef, {
      ticketNumber,
      name,
      phone,
      serviceType,
      date,
      time,
      status: "Waiting",
      counter: "",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { ticketNumber, ticketId: ticketRef.id };
  });

  logger.info("Ticket created", {
    ticketId: result.ticketId,
    ticketNumber: result.ticketNumber,
    serviceType
  });

  return result;
});

exports.callNextTicket = functions.https.onCall(async (data, context) => {
  requireAuth(context);
  const counter = normalizeString(data.counter, "counter");
  const serviceType = data.serviceType === "All" ? "All" : normalizeServiceType(data.serviceType);

  let query = db.collection("appointments")
    .where("status", "==", "Waiting")
    .orderBy("createdAt")
    .limit(1);

  if (serviceType !== "All") {
    query = query.where("serviceType", "==", serviceType);
  }

  const snapshot = await query.get();
  if (snapshot.empty) {
    logger.info("No waiting tickets to call", { serviceType, counter });
    return { ticketId: null, ticketNumber: null };
  }

  const docRef = snapshot.docs[0].ref;
  const ticketNumber = snapshot.docs[0].data().ticketNumber || null;

  await db.runTransaction(async (transaction) => {
    const docSnap = await transaction.get(docRef);
    if (!docSnap.exists) {
      return;
    }
    const currentStatus = docSnap.data().status;
    if (currentStatus !== "Waiting") {
      return;
    }
    transaction.update(docRef, {
      status: "Called",
      counter,
      calledAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  logger.info("Ticket called", {
    ticketId: docRef.id,
    ticketNumber,
    serviceType,
    counter
  });

  return { ticketId: docRef.id, ticketNumber };
});

exports.updateTicketStatus = functions.https.onCall(async (data, context) => {
  requireAuth(context);
  const docId = normalizeString(data.docId, "docId");
  const status = normalizeString(data.status, "status");
  const allowed = ["Served", "Skipped"];

  if (!allowed.includes(status)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid status update.");
  }

  await db.collection("appointments").doc(docId).update({
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  logger.info("Ticket status updated", { docId, status });

  return { ok: true };
});
