import React from 'react';

const ProjectCard = ({ project }) => {
    return (
        <div className="border rounded-lg p-4">
            <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {project.skills.map((skill, i) => (
                        <span
                            key={i}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard; 