// import React, { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
// import GoogleMapComponent from './GoogleMapComponent';

// export const CommunityPage = () => {
//   const [users, setUsers] = useState<Profile[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .not('location', 'is', null);

//       if (error) throw error;
//       setUsers(data || []);
//     } catch (error) {
//       console.error('Error loading users:', error);
//     }
//   };

//   const locations = users.map(user => ({
//     lat: user.location.lat,
//     lng: user.location.lng
//   }));

//   return (
//     <div>
//       <h1>Community Page</h1>
//       <GoogleMapComponent locations={locations} />
//       {/* Other components and features */}
//     </div>
//   );
// };