"use client";

import { useEffect, useState } from "react"

export default function RecentActivity() {
    const [activities, setActivities] = useState([]);
    
    useEffect(() => {
        async function loadActivities() {
            const response = await fetch('/api/activities', {
                method: 'GET'
            });
            const activitiesData = await response.json();
            setActivities(activitiesData || []);
        }
        loadActivities()
    }, []);

    return (
        <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow">
            <div className="p-4">
                <h3 className="text-base font-medium mb-4">Atividades Recentes</h3>
                {activities.map((activity, i) => (
                    <div key={i} className="mb-4">
                        <ul className="space-y-3">
                            <li className="flex gap-2">
                                <span className="text-gray-500">•</span>
                                <span className="font-medium text-sm">{activity?.description}</span>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
            </div>
        </div>
    )
}
