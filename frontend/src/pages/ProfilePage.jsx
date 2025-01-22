import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axios';

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(`/profiles/${id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.title}</h1>
      <p>{profile.bio}</p>
      <p>Career: {profile.careerYears} years</p>
      <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </div>
  );
};

export default ProfilePage;
