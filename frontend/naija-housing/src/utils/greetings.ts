export default function greetUser():string {
    const now = new Date();
    const hour = now.getHours();

    let greeting = 'Hi';

    if (hour < 12) {
        greeting = 'Good Aorning';
    } else if (hour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening'
    }

    return `${greeting}, `
}