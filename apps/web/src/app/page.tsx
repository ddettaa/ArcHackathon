"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const RULES = [
  { id: "1", name: "Auto Bug Bounty", desc: "Pay when PR with 'fix' label is merged", source: "github", trigger: "pull_request.merged", amount: 50, recipient: "0x1234...5678", type: "pay", enabled: false, cooldown: 3600 },
  { id: "2", name: "Flight Delay Refund", desc: "Refund when flight delayed > 2 hours", source: "api", trigger: "flight.delayed", amount: 100, recipient: "0xabcd...ef12", type: "refund", enabled: false, cooldown: 86400 },
  { id: "3", name: "Content Tip Stream", desc: "Tip writer when content hits 1000 reads", source: "api", trigger: "page.views", amount: 5, recipient: "0x9876...5432", type: "tip", enabled: false, cooldown: 604800 },
];

const sourceVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  github: "default", api: "destructive", oracle: "secondary", onchain: "outline"
};

const colors = {
  mint: "#5acda7", coral: "#ff4b31", ocean: "#1b3158", gold: "#f2a43a",
};

export default function Dashboard() {
  const [rules, setRules] = useState(RULES);
  const [showNew, setShowNew] = useState(false);
  const toggle = (id: string) => setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

  return (
    <div className="min-h-screen bg-[#f4f0e6]">
      {/* HEADER — match landing page style */}
      <header className="sticky top-0 z-50 bg-[rgba(244,240,230,0.92)] backdrop-blur-sm border-b border-foreground/10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md grid place-items-center text-primary-foreground font-black text-xs">AG</div>
            <span className="font-bold text-base">ArcGent</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">Signal-to-Payment Agent</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1.5 border-mint/30 text-mint bg-mint/5">
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              RUNNING
            </Badge>
            <span className="text-sm font-semibold">865M USDC</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-transparent border-b border-foreground/10 rounded-none pb-0 h-auto gap-1">
            {["overview", "rules", "payments"].map(t => (
              <TabsTrigger key={t} value={t} className="rounded-t-lg rounded-b-none data-[state=active]:bg-white data-[state=active]:shadow-sm capitalize text-xs font-medium px-4 py-2">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Rules", value: "4", color: "text-foreground" },
                { label: "Wallet Balance", value: "865M USDC", color: "text-[#5acda7]" },
                { label: "Last Signal Check", value: "2 min ago", color: "text-muted-foreground" },
                { label: "Network", value: "Arc Testnet", sub: "Chain ID: 5042002", color: "text-primary" },
              ].map((s, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                  </CardHeader>
                  <CardContent>
                    <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                    {s.sub && <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Flow diagram */}
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle className="text-sm">Signal → Payment Flow</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0">
                  {[
                    { icon: "📡", title: "Listen", desc: "GitHub, APIs, oracles, onchain events", bg: "bg-[#d6f0e8]" },
                    { icon: "🧠", title: "Decide", desc: "Rule engine evaluates conditions", bg: "bg-accent/30" },
                    { icon: "💸", title: "Pay", desc: "USDC via Circle Agent Stack", bg: "bg-mint/10" },
                    { icon: "✅", title: "Settle", desc: "Sub-second finality on Arc", bg: "bg-muted" },
                  ].map((step, i) => (
                    <div key={i} className="flex sm:flex-col items-center gap-3 sm:flex-1 sm:text-center">
                      <div className={`rounded-xl px-4 py-3 sm:p-4 flex-1 ${step.bg}`}>
                        <span className="text-xl">{step.icon}</span>
                        <p className="text-xs font-bold mt-1">{step.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{step.desc}</p>
                      </div>
                      {i < 3 && <span className="text-muted-foreground sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-1/2 z-10 text-lg">→</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button onClick={() => setShowNew(true)} className="h-auto py-5 justify-start bg-primary hover:bg-primary/90 rounded-xl text-left flex-col items-start shadow-sm" size="lg">
                <span className="text-base font-bold">+ New Rule</span>
                <span className="text-xs opacity-70 font-normal">Create a new signal-to-payment rule</span>
              </Button>
              <Button variant="secondary" className="h-auto py-5 justify-start rounded-xl text-left flex-col items-start shadow-sm" size="lg">
                <span className="text-base font-bold">Fund Wallet</span>
                <span className="text-xs opacity-70 font-normal">Add USDC to agent wallet via faucet</span>
              </Button>
            </div>
          </TabsContent>

          {/* RULES */}
          <TabsContent value="rules" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Rules <span className="text-muted-foreground font-normal text-sm">({rules.length})</span></h2>
              <Button onClick={() => setShowNew(true)} size="sm">+ New Rule</Button>
            </div>
            <div className="space-y-3">
              {rules.map(rule => (
                <Card key={rule.id} className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm">{rule.name}</span>
                          <Badge variant={sourceVariant[rule.source] || "secondary"} className="text-[10px]">{rule.source}</Badge>
                          <Badge variant="outline" className="text-[10px] border-mint/30 text-mint">{rule.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{rule.desc}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                          <span>Trigger: <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">{rule.trigger}</code></span>
                          <span className="font-semibold text-foreground">{rule.amount} USDC</span>
                          <span>Cooldown: {rule.cooldown}s</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={rule.enabled ? "default" : "outline"}
                        onClick={() => toggle(rule.id)}
                        className={rule.enabled ? "bg-[#5acda7] hover:bg-[#4ab894] text-white" : "text-muted-foreground"}
                      >
                        {rule.enabled ? "ON" : "OFF"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PAYMENTS */}
          <TabsContent value="payments">
            <Card className="border-0 shadow-sm">
              <CardContent className="py-16 text-center">
                <span className="text-4xl block mb-4">💳</span>
                <h3 className="font-bold text-muted-foreground">No payments yet</h3>
                <p className="text-xs text-muted-foreground mt-1">Payments will appear here once rules trigger</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* NEW RULE DIALOG */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create New Rule</DialogTitle></DialogHeader>
          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Rule Name</Label>
              <Input placeholder="e.g. Auto Bug Bounty" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Signal Source</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="api">External API</SelectItem>
                  <SelectItem value="oracle">Onchain Oracle</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Trigger Condition</Label>
              <Input placeholder="e.g. pull_request.merged" className="h-9 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Amount (USDC)</Label>
                <Input type="number" placeholder="50" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Recipient</Label>
                <Input placeholder="0x..." className="h-9 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button type="submit" className="flex-1">Create Rule</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-mint { color: #5acda7; }
        .bg-mint\\/5 { background-color: rgba(90,205,167,0.05); }
        .bg-mint\\/10 { background-color: rgba(90,205,167,0.1); }
        .border-mint\\/30 { border-color: rgba(90,205,167,0.3); }
      `}} />
    </div>
  );
}
