/**
 * Type definitions for data structures.
 * Supports consistent typing across services, controllers, and validation utilities.
 * */

import { RowDataPacket } from 'mysql2'; // Provides structural support for DB query results

// Defines the structure required when creating or updating guest data.
// Used in validation workflows.
export interface GuestInput {
  name: string;            
  email: string;           
  phone_number: string;    
  address: string;         
  isAdmin: boolean;        
}

// Represents a database row for a guest, extended for use with mysql2 queries.
// Used in GuestService logic.
export interface GuestRow extends RowDataPacket {
  pk_guest_id: number;     
  name: string;            
  email: string;           
  phone_number: string;    
  address: string;         
  isAdmin: boolean;        
}

// Response structure for detailed booking results.
// Aggregates guest and cottage summaries for simplified consumption.
export interface BookingDetails {
  booking_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  guest_count: number;
  special_requests: string | null; //  null allows this to be empty 
  guest: GuestSummary;
  cottage: CottageSummary;
}

// booking types for creating a booking. 
export type BookingInput = Omit<BookingDetails, 'guest' | 'cottage'> & {
  guest_id: number;
  cottage_name: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};



// Slimmed-down guest view used within BookingDetails.
export type GuestSummary = Omit<GuestInput, 'isAdmin'>;


// Cottage data types used in BookingDetails responses.
export interface CottageSummary {
  cottage_id: string;
  location: string;
  capacity: number;
}

//Availability data types - used in avaibalitity checking 
export interface AvailabilityResult {
  available_date: string;
  fk_cottage_name: string;
  location: string;
  capacity: number;
  price: number;
  is_available: boolean;
}

