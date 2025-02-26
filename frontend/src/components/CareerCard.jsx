import React from 'react';

const CareerCard = ({ career }) => {
    return (
        <div className="border rounded-lg p-4">
            <div>
                <h3 className="text-lg font-semibold">{career.companyName}</h3>
                <p className="text-gray-600">
                    {career.department} - {career.position}
                </p>
                <p className="text-sm text-gray-500">
                    {new Date(career.startDate).toLocaleDateString()} ~ 
                    {career.endDate ? new Date(career.endDate).toLocaleDateString() : '현재'}
                </p>
            </div>

            {/* 경력 내 프로젝트 목록 */}
            {career.projects && career.projects.length > 0 && (
                <div className="mt-4 space-y-2">
                    {career.projects.map((project, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                            <h4 className="font-semibold">{project.projectName}</h4>
                            <p className="text-sm text-gray-600">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CareerCard; 