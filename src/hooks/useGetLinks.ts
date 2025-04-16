// const { data: apiResponse, isLoading } = useQuery<ApiResponse<FamilyTree[]>>({
//     queryKey: ['familyTrees'],
//     queryFn: familyTreeApi.getTrees,
//   });

//   const trees = apiResponse?.status === 'success' ? apiResponse.data : [];

import { useQuery } from '@tanstack/react-query';
import { linkApi } from '@/services/api';
import { ApiResponse } from '@/types/ApiResponse';
import { Link } from '@/types/link';


export function useGetLinks() {
    const { data: apiResponse, isLoading } = useQuery<ApiResponse<Link[]>>({
        queryKey: ['links'],
        queryFn: linkApi.getLinks,
    });
    
    const links = apiResponse?.status === 'success' ? apiResponse.data : [];
    
    return { links, isLoading };
    }

