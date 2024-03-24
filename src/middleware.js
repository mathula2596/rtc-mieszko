import { NextResponse } from 'next/server'

export async function middleware(request) {

    const response = NextResponse.next();
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    const path = request.nextUrl.pathname
    const isPublicPath = path === "/login"

    const token = request.cookies.get('token')?.value || ''
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/rtc', request.nextUrl))
    }
    if(!isPublicPath && !token)
    {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    
    

}

export const config = {
    matcher: [
        '/users',
        '/login',
        '/rtc',
        '/rtc/create',
        '/rtc/{:id}',
        '/users/{:id}',
        '/users/create',
        '/users/change-password',
        '/'

    ]
}
