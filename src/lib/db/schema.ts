import { pgTable, serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

// Service categories enum
export const serviceCategoryEnum = pgEnum('service_category', [
  'facial',
  'hair_removal',
  'skin_treatment',
  'massage',
  'other'
]);

// Booking status enum
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'cancelled',
  'completed'
]);

// Users table (for admin access)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Services table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // Price in LYD
  duration: integer('duration'), // Duration in minutes
  category: serviceCategoryEnum('category'),
  image: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bookings table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  serviceId: integer('service_id').references(() => services.id),
  clientName: text('client_name').notNull(),
  clientPhone: text('client_phone').notNull(),
  clientEmail: text('client_email'),
  date: timestamp('date').notNull(),
  time: text('time').notNull(),
  status: bookingStatusEnum('status').default('pending'),
  notes: text('notes'),
  paymentStatus: text('payment_status').default('unpaid'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Clients table (for returning customers)
export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().unique(),
  email: text('email'),
  birthdate: timestamp('birthdate'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 