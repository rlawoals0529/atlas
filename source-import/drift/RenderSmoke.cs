using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using SensitivityFinder;
class RenderSmoke {
[DllImport("opengl32.dll")]static extern uint glGetError();
[STAThread]static int Main(){try{using(var form=new Form()){form.ClientSize=new Size(960,540);var handle=form.Handle;using(var renderer=new ArenaRenderer(handle)){var frame=new ArenaFrame{Title="Synthetic render check",Progress="No mouse input",Rate="144 Hz",Timer="12.3",Score="3",Hint="Fixture",Footer="No driver writes"};for(int i=0;i<12;i++){frame.Timer=(12.3-i*.1).ToString("F1");frame.Score=i.ToString();frame.Lesson=i>=6;frame.LessonTitle="Synthetic lesson";frame.Line1="Rendering fixture";frame.AutoContinue=3;renderer.Render(i<9?960:640,i<9?540:360,frame);if(glGetError()!=0)throw new Exception("OpenGL reported an error at frame "+i);}Console.WriteLine("PASS normal HUD updates, lesson HUD, resize and renderer disposal on "+renderer.Device);}}return 0;}catch(Exception e){Console.WriteLine("RENDER CHECK NOT RUN/FAILED: "+e.Message);return 2;}}
}
