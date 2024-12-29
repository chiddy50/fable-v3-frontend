"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserInterface } from '@/interfaces/UserInterface';
import { combineName } from '@/lib/utils';
import Link from "next/link";

const AuthorAvatarComponent = ({ user }: { user: UserInterface }) => {

    return (
        <Link href={`/author/${user.id}`}>
            <div className='inline-flex items-center cursor-pointer gap-2 mb-2 sm:mb-4'>
                <Avatar className='size-6'>
                    <AvatarImage src={user?.imageUrl} alt={combineName(user)} />
                    <AvatarFallback className='text-gray-800'>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className='text-sm'>{combineName(user)}</h2>
                </div>
            </div>
        </Link>
    )
}

export default AuthorAvatarComponent
